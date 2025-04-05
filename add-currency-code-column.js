// Add currencyCode column to the economicData table
import pg from 'pg';
const { Pool } = pg;

async function addCurrencyCodeColumn() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('Adding currencyCode column to economicData table...');
    
    // Add the new column
    await pool.query(`
      ALTER TABLE "economicData" 
      ADD COLUMN IF NOT EXISTS "currencyCode" TEXT
    `);
    
    console.log('Successfully added currencyCode column to economicData table');
  } catch (error) {
    console.error('Error adding currencyCode column:', error);
  } finally {
    await pool.end();
  }
}

addCurrencyCodeColumn();