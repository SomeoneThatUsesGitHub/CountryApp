const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { eq } = require('drizzle-orm');
const ws = require('ws');
const { economicData } = require('./shared/schema');

// Set Neon WebSocket constructor
require('@neondatabase/serverless').neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function addDemoEconomicData() {
  console.log('Adding demo economic data...');
  
  // Check if data already exists for country ID 1 (USA)
  const existingData = await db.select().from(economicData).where(eq(economicData.countryId, 1));
  
  if (existingData.length > 0) {
    console.log('Economic data already exists for USA');
  } else {
    // USA demo data
    const usaDemoData = {
      countryId: 1,
      gdp: 25000,
      gdpPerCapita: 75000,
      gdpGrowth: '3.1%',
      inflation: '2.5%',
      mainIndustries: JSON.stringify([
        { name: 'Services', percentage: 79.2 },
        { name: 'Manufacturing', percentage: 18.9 },
        { name: 'Agriculture', percentage: 0.9 },
        { name: 'Technology', percentage: 12.7 },
        { name: 'Healthcare', percentage: 15.3 },
        { name: 'Financial', percentage: 8.6 }
      ]),
      tradingPartners: JSON.stringify(['China', 'Canada', 'Mexico', 'Japan', 'Germany']),
      challenges: JSON.stringify([
        { title: 'Income Inequality', description: 'Growing gap between wealthy and poor', icon: 'fa-balance-scale' },
        { title: 'Infrastructure', description: 'Aging roads, bridges and utilities', icon: 'fa-road' }
      ]),
      reforms: JSON.stringify([
        { text: 'Tax incentives for clean energy development', icon: 'fa-sun' },
        { text: 'Infrastructure spending package', icon: 'fa-building' }
      ]),
      outlook: 'Projected stable growth with moderate inflation over next 5 years. Technology and healthcare sectors expected to lead growth.'
    };
    
    // Add USA data
    await db.insert(economicData).values(usaDemoData);
    console.log('Added USA economic data');
  }
  
  // Check if data exists for Germany (country ID 2)
  const existingGermanyData = await db.select().from(economicData).where(eq(economicData.countryId, 2));
  
  if (existingGermanyData.length > 0) {
    console.log('Economic data already exists for Germany');
  } else {
    // Add data for Germany (country ID 2)
    const germanyData = {
      countryId: 2,
      gdp: 4500,
      gdpPerCapita: 54000,
      gdpGrowth: '1.8%',
      inflation: '1.7%',
      mainIndustries: JSON.stringify([
        { name: 'Manufacturing', percentage: 28.6 },
        { name: 'Services', percentage: 68.9 },
        { name: 'Automotive', percentage: 14.2 },
        { name: 'Engineering', percentage: 10.4 },
        { name: 'Energy', percentage: 5.6 },
        { name: 'Chemical', percentage: 7.8 }
      ]),
      tradingPartners: JSON.stringify(['United States', 'France', 'China', 'Netherlands', 'Italy', 'Poland']),
      challenges: JSON.stringify([
        { title: 'Energy Transition', description: 'Shift from nuclear and coal to renewables', icon: 'fa-bolt' },
        { title: 'Aging Population', description: 'Demographic challenges affecting labor market', icon: 'fa-users' }
      ]),
      reforms: JSON.stringify([
        { text: 'Digital infrastructure investment program', icon: 'fa-network-wired' },
        { text: 'Energy transition incentives', icon: 'fa-leaf' }
      ]),
      outlook: 'Modest growth expected with focus on green technology and digital transformation. Export-driven economy remains strong but faces headwinds from global trade tensions.'
    };
    
    // Add Germany data
    await db.insert(economicData).values(germanyData);
    console.log('Added Germany economic data');
  }
  
  // Check if data exists for Switzerland (country ID 6)
  const existingSwissData = await db.select().from(economicData).where(eq(economicData.countryId, 6));
  
  if (existingSwissData.length > 0) {
    console.log('Economic data already exists for Switzerland');
  } else {
    // Add data for Switzerland (country ID 6)
    const switzerlandData = {
      countryId: 6,
      gdp: 800,
      gdpPerCapita: 92000,
      gdpGrowth: '1.5%',
      inflation: '0.5%',
      mainIndustries: JSON.stringify([
        { name: 'Financial Services', percentage: 25.5 },
        { name: 'Pharmaceuticals', percentage: 18.2 },
        { name: 'Technology', percentage: 9.4 },
        { name: 'Watchmaking', percentage: 7.8 },
        { name: 'Tourism', percentage: 6.3 },
        { name: 'Agriculture', percentage: 0.8 }
      ]),
      tradingPartners: JSON.stringify(['Germany', 'United States', 'Italy', 'France', 'China']),
      challenges: JSON.stringify([
        { title: 'Strong Currency', description: 'High franc affects export competitiveness', icon: 'fa-money-bill-wave' },
        { title: 'Banking Regulation', description: 'International pressure on banking secrecy', icon: 'fa-university' }
      ]),
      reforms: JSON.stringify([
        { text: 'Banking transparency regulations', icon: 'fa-landmark' },
        { text: 'Digital economy initiatives', icon: 'fa-microchip' }
      ]),
      outlook: 'Continued stability with modest growth. Banking sector adapting to new global transparency requirements while maintaining competitiveness.'
    };
    
    // Add Switzerland data
    await db.insert(economicData).values(switzerlandData);
    console.log('Added Switzerland economic data');
  }
  
  console.log('Demo economic data addition complete');
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
