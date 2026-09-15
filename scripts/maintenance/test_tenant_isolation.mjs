import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function runTenantIsolationTests() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("==================================================");
    console.log("   WACKODA EXPERIENCE - MULTI-TENANT RLS TESTS    ");
    console.log("==================================================\n");

    let testPasses = 0;
    let testFails = 0;

    async function runTest(testName, authUserId, query, expectedRowCount) {
      await client.query('BEGIN');
      try {
        await client.query(`SET LOCAL request.jwt.claim.sub = '${authUserId}'`);
        await client.query(`SET LOCAL role = 'authenticated'`);
        
        const res = await client.query(query);
        const actualCount = res.rows.length;

        if (actualCount === expectedRowCount) {
          console.log(`[PASS] ${testName}`);
          console.log(`       -> Returned ${actualCount} rows as expected.`);
          testPasses++;
        } else {
          console.error(`[FAIL] ${testName}`);
          console.error(`       -> Expected ${expectedRowCount} rows, but got ${actualCount} rows!`);
          console.error(`       -> Rows leak:`, res.rows);
          testFails++;
        }
      } catch (err) {
        console.error(`[ERROR] ${testName}:`, err.message);
        testFails++;
      } finally {
        await client.query('ROLLBACK');
      }
    }

    // Identifiers from Seed:
    const ALUNO_A1_AUTH_ID = 'a1111111-1111-1111-1111-222222222222'; // João (Escola A)
    const PROFESSOR_A_AUTH_ID = 'a1111111-1111-1111-1111-111111111111'; // Carlos (Escola A)
    const ADMIN_A_AUTH_ID = 'a1111111-1111-1111-1111-000000000000'; // Admin Harmonia (Escola A)
    const ESCOLA_B_ID = '22222222-2222-2222-2222-222222222222'; // Escola Ritmo

    // TEST 1: Aluno A1 cannot access Aluno B1 (Pedro) data
    await runTest(
      "TEST 1: Aluno A1 (Escola A) attempting to query Aluno B1 (Escola B)",
      ALUNO_A1_AUTH_ID,
      `SELECT * FROM students WHERE school_id = '${ESCOLA_B_ID}'`,
      0
    );

    // TEST 2: Professor A cannot access lessons from Escola B
    await runTest(
      "TEST 2: Professor A (Escola A) attempting to query lessons from Escola B",
      PROFESSOR_A_AUTH_ID,
      `SELECT * FROM lessons WHERE school_id = '${ESCOLA_B_ID}'`,
      0
    );

    // TEST 3: Admin A cannot access memberships from Escola B
    await runTest(
      "TEST 3: Admin A (Escola A) attempting to query memberships from Escola B",
      ADMIN_A_AUTH_ID,
      `SELECT * FROM school_memberships WHERE school_id = '${ESCOLA_B_ID}'`,
      0
    );

    // TEST 4: Aluno A1 cannot access contents from Escola B
    await runTest(
      "TEST 4: Aluno A1 (Escola A) attempting to view contents from Escola B",
      ALUNO_A1_AUTH_ID,
      `SELECT * FROM contents WHERE school_id = '${ESCOLA_B_ID}'`,
      0
    );

    // TEST 5: Aluno A1 cannot access video metadata or signed video records from Escola B
    await runTest(
      "TEST 5: Aluno A1 (Escola A) attempting to view video records from Escola B",
      ALUNO_A1_AUTH_ID,
      `SELECT * FROM videos WHERE school_id = '${ESCOLA_B_ID}'`,
      0
    );

    // TEST 6: Aluno A1 CAN view own lesson video in Escola A
    await runTest(
      "TEST 6: Aluno A1 (Escola A) accessing authorized video from own lesson",
      ALUNO_A1_AUTH_ID,
      `SELECT * FROM videos WHERE school_id = '11111111-1111-1111-1111-111111111111'`,
      1
    );

    console.log("\n==================================================");
    console.log(`SUMMARY: ${testPasses} PASSED | ${testFails} FAILED`);
    console.log("==================================================");

    if (testFails > 0) {
      process.exit(1);
    }

  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runTenantIsolationTests();
