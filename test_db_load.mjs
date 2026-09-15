import pg from 'pg';
const { Pool } = pg;

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function runLoadTest(totalRequests = 1000, concurrency = 100) {
  console.log(`====================================================`);
  console.log(`🚀 INICIANDO TESTE DE CARGA NO BANCO DE DADOS`);
  console.log(`Total de consultas: ${totalRequests}`);
  console.log(`Concorrência simultânea: ${concurrency} workers`);
  console.log(`====================================================\n`);

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 50, // Connection pool size locally
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });

  const latencies = [];
  let successful = 0;
  let failed = 0;
  const errors = {};

  const startTime = Date.now();
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < totalRequests) {
      const idx = currentIndex++;
      const reqStart = Date.now();
      try {
        // Query representativa: busca turmas ativas com cursos
        const res = await pool.query(`
          SELECT c.id, c.name, co.name as course_name 
          FROM classes c 
          LEFT JOIN courses co ON c.course_id = co.id 
          LIMIT 5;
        `);
        const duration = Date.now() - reqStart;
        latencies.push(duration);
        successful++;
      } catch (err) {
        failed++;
        const msg = err.message || 'Unknown error';
        errors[msg] = (errors[msg] || 0) + 1;
      }
    }
  }

  // Spawn concurrent workers
  const workers = [];
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
  const totalDuration = (Date.now() - startTime) / 1000;

  await pool.end();

  latencies.sort((a, b) => a - b);
  const sum = latencies.reduce((a, b) => a + b, 0);
  const avg = latencies.length ? (sum / latencies.length).toFixed(2) : 0;
  const min = latencies.length ? latencies[0] : 0;
  const max = latencies.length ? latencies[latencies.length - 1] : 0;
  const p50 = latencies.length ? latencies[Math.floor(latencies.length * 0.5)] : 0;
  const p90 = latencies.length ? latencies[Math.floor(latencies.length * 0.9)] : 0;
  const p95 = latencies.length ? latencies[Math.floor(latencies.length * 0.95)] : 0;
  const p99 = latencies.length ? latencies[Math.floor(latencies.length * 0.99)] : 0;
  const rps = (totalRequests / totalDuration).toFixed(2);

  console.log(`\n================ RESULTADOS DO TESTE ================`);
  console.log(`⏱️ Tempo total: ${totalDuration.toFixed(2)}s`);
  console.log(`⚡ Vazão (Throughput): ${rps} consultas/segundo`);
  console.log(`✅ Sucesso: ${successful} (${((successful / totalRequests) * 100).toFixed(1)}%)`);
  console.log(`❌ Falhas: ${failed} (${((failed / totalRequests) * 100).toFixed(1)}%)`);
  console.log(`----------------------------------------------------`);
  console.log(`📊 LATÊNCIA (Milissegundos):`);
  console.log(`   Mínima: ${min}ms`);
  console.log(`   Média:  ${avg}ms`);
  console.log(`   P50 (Mediana): ${p50}ms`);
  console.log(`   P90: ${p90}ms`);
  console.log(`   P95: ${p95}ms`);
  console.log(`   P99: ${p99}ms`);
  console.log(`   Máxima: ${max}ms`);
  if (Object.keys(errors).length > 0) {
    console.log(`----------------------------------------------------`);
    console.log(`⚠️ ERROS DETECTADOS:`, errors);
  }
  console.log(`====================================================\n`);
}

runLoadTest(1000, 100).catch(console.error);
