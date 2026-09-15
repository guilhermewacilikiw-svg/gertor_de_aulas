import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Conectado ao banco de dados...");
    
    // TRUNCATE CASCADE apaga tudo de forma segura ignorando a ordem das foreign keys
    await client.query(`TRUNCATE TABLE public.users CASCADE;`);
    await client.query(`TRUNCATE TABLE public.schools CASCADE;`);
    await client.query(`TRUNCATE TABLE auth.users CASCADE;`);

    console.log("Banco de dados completamente limpo! Todos os usuários, escolas e alunos foram removidos.");

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
  }
}

run();
