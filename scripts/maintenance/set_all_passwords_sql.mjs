import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function setAllPasswordsSQL() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Setting default password for all auth.users accounts via PostgreSQL...\n");

    const defaultPassword = 'Password123!';

    // Ensure pgcrypto extension is active
    await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;");

    const userEmails = [
      'admin@harmonia.com.br',
      'carlos@harmonia.com.br',
      'joao@harmonia.com.br',
      'maria@harmonia.com.br',
      'admin@ritmo.com.br',
      'ana@ritmo.com.br',
      'pedro@ritmo.com.br'
    ];

    for (const email of userEmails) {
      await client.query(`
        UPDATE auth.users 
        SET encrypted_password = extensions.crypt('${defaultPassword}', extensions.gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            updated_at = NOW()
        WHERE email = '${email}';
      `);
      console.log(`[PASSWORD UPDATED] ${email} -> Password123!`);
    }

    console.log("\n==================================================");
    console.log("  CREDENTIALS UPDATED SUCCESSFULLY!               ");
    console.log("  PASSWORD FOR ALL USERS: Password123!            ");
    console.log("==================================================");

  } catch (err) {
    console.error("Error setting passwords:", err);
  } finally {
    await client.end();
  }
}

setAllPasswordsSQL();
