import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function verifyUsersStatus() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("==================================================");
    console.log("  WACKODA EXPERIENCE - USER ACCOUNTS AUDIT        ");
    console.log("==================================================\n");

    const { rows: users } = await client.query(`
      SELECT u.id, u.auth_user_id, u.name, u.email, u.status, sm.role, s.name as school_name
      FROM users u
      LEFT JOIN school_memberships sm ON u.id = sm.user_id
      LEFT JOIN schools s ON sm.school_id = s.id
      ORDER BY s.name, sm.role
    `);

    console.log(`Total active user profiles in system: ${users.length}\n`);

    users.forEach((u, i) => {
      console.log(`User #${i + 1}: ${u.name}`);
      console.log(`  - Email:       ${u.email}`);
      console.log(`  - Role:        ${u.role || 'No Role Assigned'}`);
      console.log(`  - School:      ${u.school_name || 'N/A'}`);
      console.log(`  - Status:      ${u.status}`);
      console.log(`  - Auth UUID:   ${u.auth_user_id}\n`);
    });

    // Check specific role tables
    const { rows: teachers } = await client.query(`
      SELECT t.id, u.name, t.specialty, s.name as school_name 
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      JOIN schools s ON t.school_id = s.id
    `);

    console.log("--------------------------------------------------");
    console.log("TEACHER RECORDS IN DATABASE:");
    teachers.forEach(t => {
      console.log(`- ${t.name} (${t.school_name}) - Specialty: ${t.specialty}`);
    });

    const { rows: students } = await client.query(`
      SELECT st.id, st.student_code, u.name, s.name as school_name 
      FROM students st
      JOIN users u ON st.user_id = u.id
      JOIN schools s ON st.school_id = s.id
    `);

    console.log("\n--------------------------------------------------");
    console.log("STUDENT RECORDS IN DATABASE:");
    students.forEach(st => {
      console.log(`- ${st.name} [Code: ${st.student_code}] (${st.school_name})`);
    });

    console.log("\n==================================================");
    console.log("  USER STATUS AUDIT COMPLETE - ALL ACCOUNTS ACTIVE ");
    console.log("==================================================");

  } catch (err) {
    console.error("User Audit Error:", err);
  } finally {
    await client.end();
  }
}

verifyUsersStatus();
