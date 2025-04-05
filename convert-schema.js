const fs = require('fs');
const path = require('path');

// Read schema.ts
const schemaPath = path.join(__dirname, 'shared', 'schema.ts');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Create ES module version of schema.js
const jsContent = `
// This is a temporary file for database operations
import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

// Economic Data schema
export const economicData = pgTable("economicData", {
  id: serial("id").primaryKey(),
  countryId: integer("countryId").notNull(),
  gdp: integer("gdp"),
  gdpPerCapita: integer("gdpPerCapita"),
  gdpGrowth: text("gdpGrowth"),
  inflation: text("inflation"),
  mainIndustries: jsonb("mainIndustries"),
  tradingPartners: jsonb("tradingPartners"),
  challenges: jsonb("challenges"),
  reforms: jsonb("reforms"),
  outlook: text("outlook"),
  initiatives: jsonb("initiatives"),
});
`;

fs.writeFileSync(path.join(__dirname, 'shared', 'schema.js'), jsContent);
console.log('Created schema.js for ES module import');
