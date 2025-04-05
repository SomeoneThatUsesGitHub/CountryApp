const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { eq } = require('drizzle-orm');
const ws = require('ws');

// Set Neon WebSocket constructor
require('@neondatabase/serverless').neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Import schema manually since we can't import from TypeScript directly in CommonJS
const schema = {
  economicData: {
    id: { name: 'id' },
    countryId: { name: 'countryId' }
  }
};

// Create a simplified db instance
const db = drizzle(pool);

async function addDemoEconomicData() {
  console.log('Adding demo economic data...');
  
  try {
    // USA (ID: 1)
    const existingData = await db.execute(
      `SELECT id FROM "economicData" WHERE "countryId" = 1`
    );
    
    if (existingData.rowCount > 0) {
      console.log('Economic data already exists for USA');
    } else {
      // USA demo data
      await db.execute(`
        INSERT INTO "economicData" (
          "countryId", "gdp", "gdpPerCapita", "gdpGrowth", "inflation", 
          "mainIndustries", "tradingPartners", "challenges", "reforms", "outlook"
        ) VALUES (
          1, 25000, 75000, '3.1%', '2.5%',
          '[
            {"name": "Services", "percentage": 79.2},
            {"name": "Manufacturing", "percentage": 18.9},
            {"name": "Agriculture", "percentage": 0.9},
            {"name": "Technology", "percentage": 12.7},
            {"name": "Healthcare", "percentage": 15.3},
            {"name": "Financial", "percentage": 8.6}
          ]',
          '["China", "Canada", "Mexico", "Japan", "Germany"]',
          '[
            {"title": "Income Inequality", "description": "Growing gap between wealthy and poor", "icon": "fa-balance-scale"},
            {"title": "Infrastructure", "description": "Aging roads, bridges and utilities", "icon": "fa-road"}
          ]',
          '[
            {"text": "Tax incentives for clean energy development", "icon": "fa-sun"},
            {"text": "Infrastructure spending package", "icon": "fa-building"}
          ]',
          'Projected stable growth with moderate inflation over next 5 years. Technology and healthcare sectors expected to lead growth.'
        )
      `);
      console.log('Added USA economic data');
    }
    
    // Germany (ID: 2)
    const existingGermanyData = await db.execute(
      `SELECT id FROM "economicData" WHERE "countryId" = 2`
    );
    
    if (existingGermanyData.rowCount > 0) {
      console.log('Economic data already exists for Germany');
    } else {
      await db.execute(`
        INSERT INTO "economicData" (
          "countryId", "gdp", "gdpPerCapita", "gdpGrowth", "inflation", 
          "mainIndustries", "tradingPartners", "challenges", "reforms", "outlook"
        ) VALUES (
          2, 4500, 54000, '1.8%', '1.7%',
          '[
            {"name": "Manufacturing", "percentage": 28.6},
            {"name": "Services", "percentage": 68.9},
            {"name": "Automotive", "percentage": 14.2},
            {"name": "Engineering", "percentage": 10.4},
            {"name": "Energy", "percentage": 5.6},
            {"name": "Chemical", "percentage": 7.8}
          ]',
          '["United States", "France", "China", "Netherlands", "Italy", "Poland"]',
          '[
            {"title": "Energy Transition", "description": "Shift from nuclear and coal to renewables", "icon": "fa-bolt"},
            {"title": "Aging Population", "description": "Demographic challenges affecting labor market", "icon": "fa-users"}
          ]',
          '[
            {"text": "Digital infrastructure investment program", "icon": "fa-network-wired"},
            {"text": "Energy transition incentives", "icon": "fa-leaf"}
          ]',
          'Modest growth expected with focus on green technology and digital transformation. Export-driven economy remains strong but faces headwinds from global trade tensions.'
        )
      `);
      console.log('Added Germany economic data');
    }
    
    // Switzerland (ID: 6)
    const existingSwissData = await db.execute(
      `SELECT id FROM "economicData" WHERE "countryId" = 6`
    );
    
    if (existingSwissData.rowCount > 0) {
      console.log('Economic data already exists for Switzerland');
    } else {
      await db.execute(`
        INSERT INTO "economicData" (
          "countryId", "gdp", "gdpPerCapita", "gdpGrowth", "inflation", 
          "mainIndustries", "tradingPartners", "challenges", "reforms", "outlook"
        ) VALUES (
          6, 800, 92000, '1.5%', '0.5%',
          '[
            {"name": "Financial Services", "percentage": 25.5},
            {"name": "Pharmaceuticals", "percentage": 18.2},
            {"name": "Technology", "percentage": 9.4},
            {"name": "Watchmaking", "percentage": 7.8},
            {"name": "Tourism", "percentage": 6.3},
            {"name": "Agriculture", "percentage": 0.8}
          ]',
          '["Germany", "United States", "Italy", "France", "China"]',
          '[
            {"title": "Strong Currency", "description": "High franc affects export competitiveness", "icon": "fa-money-bill-wave"},
            {"title": "Banking Regulation", "description": "International pressure on banking secrecy", "icon": "fa-university"}
          ]',
          '[
            {"text": "Banking transparency regulations", "icon": "fa-landmark"},
            {"text": "Digital economy initiatives", "icon": "fa-microchip"}
          ]',
          'Continued stability with modest growth. Banking sector adapting to new global transparency requirements while maintaining competitiveness.'
        )
      `);
      console.log('Added Switzerland economic data');
    }
    
    // Add more countries
    // France (ID: 3)
    const existingFranceData = await db.execute(
      `SELECT id FROM "economicData" WHERE "countryId" = 3`
    );
    
    if (existingFranceData.rowCount > 0) {
      console.log('Economic data already exists for France');
    } else {
      await db.execute(`
        INSERT INTO "economicData" (
          "countryId", "gdp", "gdpPerCapita", "gdpGrowth", "inflation", 
          "mainIndustries", "tradingPartners", "challenges", "reforms", "outlook"
        ) VALUES (
          3, 2900, 42000, '1.3%', '1.5%',
          '[
            {"name": "Services", "percentage": 70.3},
            {"name": "Manufacturing", "percentage": 19.5},
            {"name": "Tourism", "percentage": 7.4},
            {"name": "Agriculture", "percentage": 1.6},
            {"name": "Luxury Goods", "percentage": 4.8},
            {"name": "Energy", "percentage": 2.6}
          ]',
          '["Germany", "United States", "Italy", "Spain", "Belgium"]',
          '[
            {"title": "Labor Market Reform", "description": "Rigid employment regulations and high unemployment", "icon": "fa-user-tie"},
            {"title": "Public Debt", "description": "High government spending and social benefits", "icon": "fa-euro-sign"}
          ]',
          '[
            {"text": "Labor code modernization", "icon": "fa-briefcase"},
            {"text": "Digital economy initiative", "icon": "fa-laptop-code"}
          ]',
          'Moderate growth with focus on innovation and maintaining social welfare system. Tourism and luxury goods sectors continue to be key economic drivers.'
        )
      `);
      console.log('Added France economic data');
    }
    
    console.log('Demo economic data addition complete');
  } catch (error) {
    console.error('Error adding economic data:', error);
    throw error;
  }
}

addDemoEconomicData()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });