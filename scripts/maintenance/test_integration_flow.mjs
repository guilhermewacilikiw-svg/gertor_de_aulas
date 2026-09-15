import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function runFullIntegrationTest() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("==================================================");
    console.log("  WACKODA EXPERIENCE - FULL INTEGRATION SUITE     ");
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

    // 1. VERIFY CORE TENANTS IN DATABASE
    const { rows: schools } = await client.query("SELECT id, name FROM schools ORDER BY name");
    assert(schools.length >= 2, `Database contains ${schools.length} schools (Escola Harmonia and Escola Ritmo).`);

    const harmonia = schools.find(s => s.name === 'Escola Harmonia');
    const ritmo = schools.find(s => s.name === 'Escola Ritmo');

    assert(!!harmonia, "Escola Harmonia (Escola A) exists.");
    assert(!!ritmo, "Escola Ritmo (Escola B) exists.");

    // 2. VERIFY TEACHERS AND STUDENTS
    const { rows: teachers } = await client.query("SELECT * FROM teachers");
    assert(teachers.length >= 2, `Registered teachers found: ${teachers.length}`);

    const { rows: students } = await client.query("SELECT * FROM students");
    assert(students.length >= 3, `Registered students found: ${students.length} (João, Maria, Pedro)`);

    // 3. VERIFY COURSES AND CLASSES
    const { rows: courses } = await client.query("SELECT * FROM courses");
    assert(courses.length >= 2, `Generic courses found: ${courses.length} (Violão Básico, Dança Básica)`);

    // 4. TEST TEACHER LESSON COMPLETION FLOW AT DATABASE LEVEL
    console.log("\n--- Testing Teacher Lesson Completion Transaction ---");

    const testLessonId = '10000000-0000-0000-0000-500000000002'; // Scheduled lesson for Harmonia
    const testSchoolId = harmonia.id;
    const testTeacherId = '10000000-0000-0000-0000-100000000001'; // Carlos
    const testStudentId = '10000000-0000-0000-0000-200000000001'; // João

    // Mark lesson as completed
    await client.query(`
      UPDATE lessons 
      SET status = 'completed', completed_at = NOW(), actual_start = NOW(), actual_end = NOW()
      WHERE id = '${testLessonId}' AND school_id = '${testSchoolId}'
    `);

    // Upsert lesson record
    await client.query(`
      INSERT INTO lesson_records (school_id, lesson_id, teacher_id, summary, topics, practice_instructions)
      VALUES (
        '${testSchoolId}', '${testLessonId}', '${testTeacherId}',
        'Troca de acordes F para C com ritmo acentuado',
        ARRAY['Acordo F', 'Acordo C', 'Exercício de Transição'],
        'Treinar 15 minutos diariamente a troca de F para C.'
      )
      ON CONFLICT (lesson_id) DO UPDATE SET summary = EXCLUDED.summary;
    `);

    // Upsert attendance
    await client.query(`
      INSERT INTO attendance (school_id, lesson_id, student_id, status, marked_by)
      VALUES (
        '${testSchoolId}', '${testLessonId}', '${testStudentId}', 'present',
        (SELECT user_id FROM teachers WHERE id = '${testTeacherId}')
      )
      ON CONFLICT (lesson_id, student_id) DO UPDATE SET status = 'present';
    `);

    // Attach private lesson video
    await client.query(`
      INSERT INTO videos (school_id, lesson_id, title, storage_path, duration, processing_status, visibility)
      VALUES (
        '${testSchoolId}', '${testLessonId}',
        'Exercício Prático Transição F-C',
        'school/${testSchoolId}/lessons/${testLessonId}/videos/exercicio_f_c.mp4',
        120, 'ready', 'students'
      );
    `);

    // Insert student notification
    await client.query(`
      INSERT INTO notifications (school_id, user_id, type, title, message)
      VALUES (
        '${testSchoolId}',
        (SELECT user_id FROM students WHERE id = '${testStudentId}'),
        'lesson_completed',
        'Nova Aula Gravada! 🎸',
        'Sua aula de transição F -> C foi registrada. Acesse seu resumo e pratique!'
      );
    `);

    // Verify written data
    const { rows: updatedLesson } = await client.query(`SELECT status FROM lessons WHERE id = '${testLessonId}'`);
    assert(updatedLesson[0]?.status === 'completed', "Lesson status successfully updated to 'completed'.");

    const { rows: recordCheck } = await client.query(`SELECT summary FROM lesson_records WHERE lesson_id = '${testLessonId}'`);
    assert(recordCheck[0]?.summary.includes('Troca de acordes'), "Lesson record summary successfully registered.");

    const { rows: videoCheck } = await client.query(`SELECT title FROM videos WHERE lesson_id = '${testLessonId}'`);
    assert(videoCheck.length > 0, "Private lesson video metadata successfully linked.");

    const { rows: notifCheck } = await client.query(`SELECT title FROM notifications WHERE school_id = '${testSchoolId}'`);
    assert(notifCheck.length > 0, "Student notification successfully generated.");

    // 5. TEST LEAD REGISTRATION FLOW
    console.log("\n--- Testing Lead Registration Flow ---");
    const testLeadEmail = `lead.test.${Date.now()}@exemplo.com`;
    await client.query(`
      INSERT INTO leads (school_id, name, email, phone, course_interest, source, status)
      VALUES ('${testSchoolId}', 'Lead Teste Automatizado', '${testLeadEmail}', '(11) 99999-8888', 'Violão', 'landing_page', 'new')
    `);

    const { rows: leadResult } = await client.query(`SELECT * FROM leads WHERE email = '${testLeadEmail}'`);
    assert(leadResult.length === 1 && leadResult[0].status === 'new', "Landing page trial lead successfully created with status 'new'.");

    // 6. RLS SECURITY ISOLATION VERIFICATION AGAIN
    console.log("\n--- Re-verifying RLS Security Isolation ---");
    await client.query('BEGIN');
    await client.query(`SET LOCAL request.jwt.claim.sub = 'a1111111-1111-1111-1111-222222222222'`); // João (Escola A)
    await client.query(`SET LOCAL role = 'authenticated'`);

    const { rows: escolaBLeakedRows } = await client.query(`SELECT * FROM students WHERE school_id = '${ritmo.id}'`);
    assert(escolaBLeakedRows.length === 0, "RLS Strict Rule: Student in Escola A gets 0 rows when attempting to read Escola B students.");

    const { rows: escolaBVideoLeakedRows } = await client.query(`SELECT * FROM videos WHERE school_id = '${ritmo.id}'`);
    assert(escolaBVideoLeakedRows.length === 0, "RLS Strict Rule: Student in Escola A gets 0 rows when attempting to read Escola B videos.");
    await client.query('ROLLBACK');

    console.log("\n==================================================");
    console.log(`INTEGRATION SUITE RESULT: ${passCount} PASSED | ${failCount} FAILED`);
    console.log("==================================================");

    if (failCount > 0) {
      process.exit(1);
    }

  } catch (err) {
    console.error("Integration Test Suite Failure:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runFullIntegrationTest();
