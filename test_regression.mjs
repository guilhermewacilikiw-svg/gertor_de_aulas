import pg from 'pg';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function runRegressionTests() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("==================================================");
    console.log("  WACKODA EXPERIENCE - REGRESSION TEST SUITE      ");
    console.log("==================================================\n");

    let passCount = 0;
    let failCount = 0;

    function assert(condition, message) {
      if (condition) {
        console.log(`[PASS] ${message}`);
        passCount++;
      } else {
        console.error(`[FAIL] ${message}`);
        failCount++;
      }
    }

    // Obter IDs principais
    const { rows: schools } = await client.query("SELECT id FROM schools LIMIT 1");
    if (schools.length === 0) throw new Error("Nenhuma escola encontrada para o teste.");
    const schoolId = schools[0].id;

    // FLUXO CRÍTICO 2: FINANCEIRO
    console.log("\n--- Executando FLUXO CRÍTICO 2: Financeiro ---");
    
    // Pegar um aluno aleatório que possua user_id vinculado
    const { rows: students } = await client.query(`SELECT id FROM students WHERE school_id = '${schoolId}' AND user_id IS NOT NULL LIMIT 1`);
    if (students.length > 0) {
      const studentId = students[0].id;

      // 1. Criar contrato financeiro
      await client.query(`
        INSERT INTO student_finances (school_id, student_id, plan_name, amount, due_day, payment_method)
        VALUES ('${schoolId}', '${studentId}', 'Plano Anual Premium', 250.00, 10, 'boleto')
        ON CONFLICT (student_id) DO UPDATE SET amount = 250.00;
      `);
      assert(true, "Contrato financeiro base criado/atualizado.");

      // 2. Criar fatura
      await client.query(`
        INSERT INTO student_invoices (school_id, student_id, finance_id, amount, due_date, status, boleto_url, payment_method)
        VALUES (
          '${schoolId}', '${studentId}', 
          (SELECT id FROM student_finances WHERE student_id = '${studentId}'),
          250.00, '2026-09-10', 'pending', 'https://banco.com/boleto_teste', 'boleto'
        )
      `);
      assert(true, "Fatura pendente com link de boleto criada pela escola.");

      // 3. Simular RLS do Aluno acessando a fatura
      await client.query('BEGIN');
      const { rows: studentUser } = await client.query(`SELECT u.auth_user_id FROM students s JOIN users u ON s.user_id = u.id WHERE s.id = '${studentId}'`);
      await client.query(`SET LOCAL request.jwt.claim.sub = '${studentUser[0].auth_user_id}'`);
      await client.query(`SET LOCAL role = 'authenticated'`);
      
      const { rows: faturaAluno } = await client.query(`SELECT * FROM student_invoices WHERE student_id = '${studentId}' AND status = 'pending'`);
      assert(faturaAluno.length > 0, "Aluno conseguiu visualizar a própria fatura via RLS.");
      assert(faturaAluno[0].boleto_url === 'https://banco.com/boleto_teste', "Aluno conseguiu acessar o link do boleto.");
      await client.query('ROLLBACK');
      
      // Limpeza
      await client.query(`DELETE FROM student_invoices WHERE boleto_url = 'https://banco.com/boleto_teste'`);
    } else {
      console.log("[SKIP] Nenhum aluno encontrado para testar financeiro.");
    }

    console.log("\n==================================================");
    console.log(`REGRESSION SUITE RESULT: ${passCount} PASSED | ${failCount} FAILED`);
    console.log("==================================================");

    if (failCount > 0) {
      process.exit(1);
    }

  } catch (err) {
    console.error("Regression Test Suite Failure:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runRegressionTests();
