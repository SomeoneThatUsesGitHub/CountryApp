import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { z } from "zod";
import { 
  insertTimelineEventSchema, 
  insertPoliticalLeaderSchema, 
  insertPoliticalSystemSchema,
  insertPoliticalPartySchema,
  insertInternationalRelationSchema,
  insertHistoricalLawSchema,
  insertStatisticSchema,
  insertEconomicDataSchema,
  insertCountrySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize data fetching for countries
  app.get("/api/initialize", async (req, res) => {
    try {
      const countries = await storage.getAllCountries();
      
      // Only fetch if we have fewer than 200 countries (assume data is incomplete)
      if (countries.length < 200) {
        console.log(`Found ${countries.length} countries. Attempting to fetch more from API.`);
        
        // We will try to fetch from two sources to maximize our chances
        const apiSources = [
          "https://restcountries.com/v3.1/all",
          "https://restcountries.com/v2/all" // Fallback to v2 API if v3 fails
        ];
        
        let fetchSuccessful = false;
        let countriesData = [];
        
        // Try each API source
        for (const apiUrl of apiSources) {
          if (fetchSuccessful) break;
          
          try {
            console.log(`Trying to fetch countries from ${apiUrl}`);
            const response = await axios.get(apiUrl, { 
              timeout: 15000, // Increased timeout
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; CountryExplorer/1.0)'
              }
            });
            
            if (response.status === 200 && Array.isArray(response.data)) {
              countriesData = response.data;
              fetchSuccessful = true;
              console.log(`Successfully fetched ${countriesData.length} countries from ${apiUrl}`);
            }
          } catch (sourceError: any) {
            console.error(`Error fetching from ${apiUrl}:`, sourceError.message || 'Unknown error');
          }
        }
        
        // If we successfully fetched countries data
        if (fetchSuccessful && countriesData.length > 0) {
          // Create a map of existing country codes for quick lookup
          const existingCountryCodes = new Set(countries.map(c => c.alpha3Code));
          let countAdded = 0;
          
          for (const countryData of countriesData) {
            try {
              // Skip if country already exists in the database
              const alpha3 = countryData.alpha3Code || countryData.cca3;
              if (existingCountryCodes.has(alpha3)) {
                continue;
              }
              
              // Handle differences between v2 and v3 API responses
              const isV3Format = countryData.cca3 !== undefined;
              
              const country = {
                name: isV3Format ? countryData.name.common : countryData.name,
                alpha2Code: isV3Format ? countryData.cca2 : countryData.alpha2Code,
                alpha3Code: isV3Format ? countryData.cca3 : countryData.alpha3Code,
                capital: isV3Format 
                  ? (countryData.capital ? countryData.capital[0] : null) 
                  : (countryData.capital || null),
                region: countryData.region || null,
                subregion: countryData.subregion || null,
                population: countryData.population || null,
                area: countryData.area || null,
                flagUrl: isV3Format 
                  ? (countryData.flags ? countryData.flags.svg : null)
                  : (countryData.flags ? countryData.flags.svg : null),
                coatOfArmsUrl: isV3Format
                  ? (countryData.coatOfArms ? countryData.coatOfArms.svg : null)
                  : null,
                mapUrl: isV3Format 
                  ? (countryData.maps ? countryData.maps.googleMaps : null)
                  : null,
                independent: countryData.independent || false,
                unMember: countryData.unMember || false,
                currencies: countryData.currencies || null,
                languages: countryData.languages || null,
                borders: countryData.borders || null,
                timezones: countryData.timezones || null,
                startOfWeek: countryData.startOfWeek || null,
                capitalInfo: countryData.capitalInfo || null,
                postalCode: countryData.postalCode || null,
                flag: countryData.flag || null,
                countryInfo: {
                  capital: isV3Format 
                    ? (countryData.capital ? countryData.capital[0] : null)
                    : (countryData.capital || null),
                  region: countryData.region || null,
                  subregion: countryData.subregion || null,
                  population: countryData.population || null,
                  governmentForm: null, // To be added manually or from another source
                }
              };
              
              await storage.createCountry(country);
              countAdded++;
              
            } catch (countryError: any) {
              console.error(`Error processing country ${countryData?.name?.common || countryData?.name || 'unknown'}:`, countryError.message || 'Unknown error');
              // Continue processing other countries
            }
          }
          
          console.log(`Added ${countAdded} new countries to the database`);
          
          // If we didn't add any new countries, check if we need to create sample countries
          if (countAdded === 0 && countries.length < 6) {
            // Only create sample countries if we have fewer than 6 countries total
            await createSampleCountries();
          }
        } else {
          console.log("Could not fetch countries from any API source");
          
          // Only create sample countries if we have fewer than 6 countries
          if (countries.length < 6) {
            await createSampleCountries();
          }
        }
      } else {
        console.log(`Database already has ${countries.length} countries. Skipping fetch.`);
      }
      
      res.json({ success: true, message: "Countries data initialized successfully" });
    } catch (error) {
      console.error("Error initializing countries data:", error);
      res.status(500).json({ success: false, message: "Failed to initialize countries data" });
    }
  });
  
  // Helper function to create sample countries when API fails
  async function createSampleCountries() {
    console.log("Creating sample countries as fallback");
    
    const sampleCountries = [
      {
        name: "United States",
        alpha2Code: "US",
        alpha3Code: "USA",
        capital: "Washington, D.C.",
        region: "Americas",
        subregion: "North America",
        population: 331002651,
        area: 9833517,
        flagUrl: "https://flagcdn.com/us.svg",
        coatOfArmsUrl: null,
        mapUrl: "https://goo.gl/maps/e8M246zY4BSjkjAv6",
        independent: true,
        unMember: true,
        currencies: null,
        languages: null,
        borders: null,
        timezones: null,
        startOfWeek: "sunday",
        capitalInfo: null,
        postalCode: null,
        flag: "🇺🇸",
        countryInfo: {
          capital: "Washington, D.C.",
          region: "Americas",
          subregion: "North America",
          population: 331002651,
          governmentForm: "Federal Republic"
        }
      },
      {
        name: "Germany",
        alpha2Code: "DE",
        alpha3Code: "DEU",
        capital: "Berlin",
        region: "Europe",
        subregion: "Western Europe",
        population: 83240525,
        area: 357114,
        flagUrl: "https://flagcdn.com/de.svg",
        coatOfArmsUrl: null,
        mapUrl: "https://goo.gl/maps/mD9FBMq1nvXUBrkv6",
        independent: true,
        unMember: true,
        currencies: null,
        languages: null,
        borders: null,
        timezones: null,
        startOfWeek: "monday",
        capitalInfo: null,
        postalCode: null,
        flag: "🇩🇪",
        countryInfo: {
          capital: "Berlin",
          region: "Europe",
          subregion: "Western Europe",
          population: 83240525,
          governmentForm: "Federal Parliamentary Republic"
        }
      },
      {
        name: "Japan",
        alpha2Code: "JP",
        alpha3Code: "JPN",
        capital: "Tokyo",
        region: "Asia",
        subregion: "Eastern Asia",
        population: 125836021,
        area: 377930,
        flagUrl: "https://flagcdn.com/jp.svg",
        coatOfArmsUrl: null,
        mapUrl: "https://goo.gl/maps/NGTLSCSrA8bMrvnX9",
        independent: true,
        unMember: true,
        currencies: null,
        languages: null,
        borders: null,
        timezones: null,
        startOfWeek: "monday",
        capitalInfo: null,
        postalCode: null,
        flag: "🇯🇵",
        countryInfo: {
          capital: "Tokyo",
          region: "Asia",
          subregion: "Eastern Asia",
          population: 125836021,
          governmentForm: "Unitary Parliamentary Constitutional Monarchy"
        }
      },
      {
        name: "South Africa",
        alpha2Code: "ZA",
        alpha3Code: "ZAF",
        capital: "Pretoria",
        region: "Africa",
        subregion: "Southern Africa",
        population: 59308690,
        area: 1221037,
        flagUrl: "https://flagcdn.com/za.svg",
        coatOfArmsUrl: null,
        mapUrl: "https://goo.gl/maps/CLCZ1R8Uz1KpYhRv6",
        independent: true,
        unMember: true,
        currencies: null,
        languages: null,
        borders: null,
        timezones: null,
        startOfWeek: "monday",
        capitalInfo: null,
        postalCode: null,
        flag: "🇿🇦",
        countryInfo: {
          capital: "Pretoria",
          region: "Africa",
          subregion: "Southern Africa",
          population: 59308690,
          governmentForm: "Parliamentary Republic"
        }
      },
      {
        name: "Australia",
        alpha2Code: "AU",
        alpha3Code: "AUS",
        capital: "Canberra",
        region: "Oceania",
        subregion: "Australia and New Zealand",
        population: 25687041,
        area: 7692024,
        flagUrl: "https://flagcdn.com/au.svg",
        coatOfArmsUrl: null,
        mapUrl: "https://goo.gl/maps/DcjaDa7UbhnZTndH6",
        independent: true,
        unMember: true,
        currencies: null,
        languages: null,
        borders: null,
        timezones: null,
        startOfWeek: "monday",
        capitalInfo: null,
        postalCode: null,
        flag: "🇦🇺",
        countryInfo: {
          capital: "Canberra",
          region: "Oceania",
          subregion: "Australia and New Zealand",
          population: 25687041,
          governmentForm: "Federal Parliamentary Constitutional Monarchy"
        }
      },
      {
        name: "Switzerland",
        alpha2Code: "CH",
        alpha3Code: "CHE",
        capital: "Bern",
        region: "Europe",
        subregion: "Western Europe",
        population: 8654622,
        area: 41284,
        flagUrl: "https://flagcdn.com/ch.svg",
        coatOfArmsUrl: null,
        mapUrl: "https://goo.gl/maps/uVuZcXaxSx5jLyv87",
        independent: true,
        unMember: true,
        currencies: null,
        languages: null,
        borders: null,
        timezones: null,
        startOfWeek: "monday",
        capitalInfo: null,
        postalCode: null,
        flag: "🇨🇭",
        countryInfo: {
          capital: "Bern",
          region: "Europe",
          subregion: "Western Europe",
          population: 8654622,
          governmentForm: "Federal Republic"
        }
      }
    ];
    
    for (const country of sampleCountries) {
      await storage.createCountry(country);
    }
  }

  // Get all countries
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getAllCountries();
      res.json(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });
  
  // Debug route to get all available country codes
  app.get("/api/countries/debug/codes", async (req, res) => {
    try {
      const countries = await storage.getAllCountries();
      const codes = countries.map(c => ({ 
        name: c.name, 
        alpha2Code: c.alpha2Code, 
        alpha3Code: c.alpha3Code 
      }));
      res.json(codes);
    } catch (error) {
      console.error("Error fetching country codes:", error);
      res.status(500).json({ message: "Failed to fetch country codes" });
    }
  });

  // Get countries by region
  app.get("/api/countries/region/:region", async (req, res) => {
    try {
      const { region } = req.params;
      const countries = await storage.getCountriesByRegion(region);
      res.json(countries);
    } catch (error) {
      console.error(`Error fetching countries for region ${req.params.region}:`, error);
      res.status(500).json({ message: "Failed to fetch countries by region" });
    }
  });

  // Get country by code
  app.get("/api/countries/code/:code", async (req, res) => {
    try {
      const { code } = req.params;
      console.log("Finding country with code:", code);
      const country = await storage.getCountryByCode(code);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      console.log("Found country:", country.name);
      res.json(country);
    } catch (error) {
      console.error(`Error fetching country with code ${req.params.code}:`, error);
      res.status(500).json({ message: "Failed to fetch country by code" });
    }
  });

  // Get country by ID
  app.get("/api/countries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const country = await storage.getCountryById(id);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      res.json(country);
    } catch (error) {
      console.error(`Error fetching country with id ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch country by id" });
    }
  });

  // Update country by ID
  app.patch("/api/countries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const country = await storage.getCountryById(id);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Update the country
      const updatedCountry = await storage.updateCountry(id, req.body);
      if (!updatedCountry) {
        return res.status(500).json({ message: "Failed to update country" });
      }
      
      res.json(updatedCountry);
    } catch (error: any) {
      console.error(`Error updating country with id ${req.params.id}:`, error);
      res.status(400).json({ message: error.message || "Failed to update country" });
    }
  });

  // Timeline events routes
  app.get("/api/countries/:countryId/timeline", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const events = await storage.getTimelineEventsByCountryId(countryId);
      res.json(events);
    } catch (error) {
      console.error(`Error fetching timeline events for country ${req.params.countryId}:`, error);
      res.status(500).json({ message: "Failed to fetch timeline events" });
    }
  });

  app.post("/api/countries/:countryId/timeline", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const country = await storage.getCountryById(countryId);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Use date as a string without conversion
      const data = {
        ...req.body,
        countryId,
        date: req.body.date || null,
      };
      
      const validatedData = insertTimelineEventSchema.parse(data);
      
      const event = await storage.createTimelineEvent(validatedData);
      res.status(201).json(event);
    } catch (error: any) {
      console.error(`Error creating timeline event:`, error);
      res.status(400).json({ message: error.message || "Failed to create timeline event" });
    }
  });

  // Statistics routes
  app.get("/api/countries/:countryId/statistics", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const statistics = await storage.getStatisticsByCountryId(countryId);
      res.json(statistics);
    } catch (error) {
      console.error(`Error fetching statistics for country ${req.params.countryId}:`, error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.post("/api/countries/:countryId/statistics", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const country = await storage.getCountryById(countryId);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      const data = {
        ...req.body,
        countryId,
      };
      
      const validatedData = insertStatisticSchema.parse(data);
      
      const statistic = await storage.createStatistic(validatedData);
      res.status(201).json(statistic);
    } catch (error: any) {
      console.error(`Error creating statistic:`, error);
      res.status(400).json({ message: error.message || "Failed to create statistic" });
    }
  });

  app.patch("/api/statistics/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedStatistic = await storage.updateStatistic(id, req.body);
      
      if (!updatedStatistic) {
        return res.status(404).json({ message: "Statistic not found" });
      }
      
      res.json(updatedStatistic);
    } catch (error: any) {
      console.error(`Error updating statistic with id ${req.params.id}:`, error);
      res.status(400).json({ message: error.message || "Failed to update statistic" });
    }
  });

  app.delete("/api/statistics/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteStatistic(id);
      
      if (!success) {
        return res.status(404).json({ message: "Statistic not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting statistic with id ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete statistic" });
    }
  });
  
  // Political leaders routes
  app.get("/api/countries/:countryId/leaders", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const leaders = await storage.getPoliticalLeadersByCountryId(countryId);
      res.json(leaders);
    } catch (error) {
      console.error(`Error fetching political leaders for country ${req.params.countryId}:`, error);
      res.status(500).json({ message: "Failed to fetch political leaders" });
    }
  });

  app.post("/api/countries/:countryId/leaders", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const country = await storage.getCountryById(countryId);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Format the data
      const data = {
        ...req.body,
        countryId,
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
        ideologies: req.body.ideologies || [],
      };
      
      const validatedData = insertPoliticalLeaderSchema.parse(data);
      
      const leader = await storage.createPoliticalLeader(validatedData);
      res.status(201).json(leader);
    } catch (error: any) {
      console.error(`Error creating political leader:`, error);
      res.status(400).json({ message: error.message || "Failed to create political leader" });
    }
  });

  // Political system routes
  app.get("/api/countries/:countryId/political-system", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const system = await storage.getPoliticalSystemByCountryId(countryId);
      
      if (!system) {
        return res.status(404).json({ message: "Political system not found" });
      }
      
      res.json(system);
    } catch (error) {
      console.error(`Error fetching political system for country ${req.params.countryId}:`, error);
      res.status(500).json({ message: "Failed to fetch political system" });
    }
  });

  app.post("/api/countries/:countryId/political-system", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const country = await storage.getCountryById(countryId);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Check if political system already exists
      const existingSystem = await storage.getPoliticalSystemByCountryId(countryId);
      
      if (existingSystem) {
        return res.status(400).json({ message: "Political system already exists for this country. Use PUT to update." });
      }
      
      // Prepare data
      const data = {
        ...req.body,
        countryId,
        freedomIndex: req.body.freedomIndex ? parseInt(req.body.freedomIndex) : null,
        governmentBranches: req.body.governmentBranches || [],
        democraticPrinciples: req.body.democraticPrinciples || [],
        internationalRelations: req.body.internationalRelations || [],
        laws: req.body.laws || [],
        organizations: req.body.organizations || [],
      };
      
      const validatedData = insertPoliticalSystemSchema.parse(data);
      
      const system = await storage.createPoliticalSystem(validatedData);
      res.status(201).json(system);
    } catch (error: any) {
      console.error(`Error creating political system:`, error);
      res.status(400).json({ message: error.message || "Failed to create political system" });
    }
  });

  app.patch("/api/countries/:countryId/timeline/:id", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const eventId = parseInt(req.params.id);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing event to verify ownership
      const existingEvent = await storage.getTimelineEventsByCountryId(countryId);
      const event = existingEvent.find(e => e.id === eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Timeline event not found for this country" });
      }
      
      // Format the data for update
      const data = {
        ...req.body,
        countryId,
        // Use date as a string without conversion
        date: req.body.date || undefined,
      };
      
      // Update the timeline event
      const updatedEvent = await storage.updateTimelineEvent(eventId, data);
      if (!updatedEvent) {
        return res.status(500).json({ message: "Failed to update timeline event" });
      }
      
      res.json(updatedEvent);
    } catch (error: any) {
      console.error(`Error updating timeline event:`, error);
      res.status(400).json({ message: error.message || "Failed to update timeline event" });
    }
  });

  app.delete("/api/countries/:countryId/timeline/:id", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const eventId = parseInt(req.params.id);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing event to verify ownership
      const existingEvent = await storage.getTimelineEventsByCountryId(countryId);
      const event = existingEvent.find(e => e.id === eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Timeline event not found for this country" });
      }
      
      // Delete the timeline event
      const deleted = await storage.deleteTimelineEvent(eventId);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete timeline event" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting timeline event:`, error);
      res.status(500).json({ message: "Failed to delete timeline event" });
    }
  });

  // PATCH for updating political leaders
  app.patch("/api/countries/:countryId/leaders/:id", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const leaderId = parseInt(req.params.id);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing leader to verify ownership
      const existingLeaders = await storage.getPoliticalLeadersByCountryId(countryId);
      const leader = existingLeaders.find(l => l.id === leaderId);
      
      if (!leader) {
        return res.status(404).json({ message: "Political leader not found for this country" });
      }
      
      // Format the data for update
      const data = {
        ...req.body,
        countryId,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        ideologies: req.body.ideologies || undefined,
      };
      
      // Update the political leader
      const updatedLeader = await storage.updatePoliticalLeader(leaderId, data);
      if (!updatedLeader) {
        return res.status(500).json({ message: "Failed to update political leader" });
      }
      
      res.json(updatedLeader);
    } catch (error: any) {
      console.error(`Error updating political leader:`, error);
      res.status(400).json({ message: error.message || "Failed to update political leader" });
    }
  });

  // DELETE for political leaders
  app.delete("/api/countries/:countryId/leaders/:id", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const leaderId = parseInt(req.params.id);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing leader to verify ownership
      const existingLeaders = await storage.getPoliticalLeadersByCountryId(countryId);
      const leader = existingLeaders.find(l => l.id === leaderId);
      
      if (!leader) {
        return res.status(404).json({ message: "Political leader not found for this country" });
      }
      
      // Delete the political leader
      const deleted = await storage.deletePoliticalLeader(leaderId);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete political leader" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting political leader:`, error);
      res.status(500).json({ message: "Failed to delete political leader" });
    }
  });

  // PATCH for updating political system
  app.patch("/api/countries/:countryId/political-system", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing system
      const existingSystem = await storage.getPoliticalSystemByCountryId(countryId);
      
      if (!existingSystem) {
        return res.status(404).json({ message: "Political system not found for this country" });
      }
      
      // Format the data for update
      const data = {
        ...req.body,
        countryId,
        freedomIndex: req.body.freedomIndex ? parseInt(req.body.freedomIndex) : undefined,
        governmentBranches: req.body.governmentBranches || undefined,
        democraticPrinciples: req.body.democraticPrinciples || undefined,
        internationalRelations: req.body.internationalRelations || undefined,
        laws: req.body.laws || undefined,
        organizations: req.body.organizations || undefined,
        hasUnstablePoliticalSituation: req.body.hasUnstablePoliticalSituation !== undefined 
          ? Boolean(req.body.hasUnstablePoliticalSituation) 
          : undefined,
        ongoingConflicts: req.body.ongoingConflicts || undefined,
      };
      
      // Update the political system
      const updatedSystem = await storage.updatePoliticalSystem(existingSystem.id, data);
      if (!updatedSystem) {
        return res.status(500).json({ message: "Failed to update political system" });
      }
      
      res.json(updatedSystem);
    } catch (error: any) {
      console.error(`Error updating political system:`, error);
      res.status(400).json({ message: error.message || "Failed to update political system" });
    }
  });

  // Political system routes
  app.get("/api/countries/:countryId/political-system", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const politicalSystem = await storage.getPoliticalSystemByCountryId(countryId);
      
      if (!politicalSystem) {
        return res.status(404).json({ message: "Political system not found" });
      }
      
      res.json(politicalSystem);
    } catch (error) {
      console.error(`Error fetching political system for country ${req.params.countryId}:`, error);
      res.status(500).json({ message: "Failed to fetch political system" });
    }
  });
  
  app.post("/api/countries/:countryId/political-system", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const country = await storage.getCountryById(countryId);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      const data = {
        ...req.body,
        countryId,
        hasUnstablePoliticalSituation: req.body.hasUnstablePoliticalSituation !== undefined 
          ? Boolean(req.body.hasUnstablePoliticalSituation) 
          : false,
        ongoingConflicts: req.body.ongoingConflicts || [],
      };
      
      const validatedData = insertPoliticalSystemSchema.parse(data);
      
      const politicalSystem = await storage.createPoliticalSystem(validatedData);
      res.status(201).json(politicalSystem);
    } catch (error: any) {
      console.error(`Error creating political system:`, error);
      res.status(400).json({ message: error.message || "Failed to create political system" });
    }
  });
  
  app.patch("/api/countries/:countryId/political-system/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const countryId = parseInt(req.params.countryId);
      
      // Check if country exists
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Check if political system exists
      const existingSystem = await storage.getPoliticalSystemByCountryId(countryId);
      if (!existingSystem || existingSystem.id !== id) {
        return res.status(404).json({ message: "Political system not found for this country" });
      }
      
      const updatedSystem = await storage.updatePoliticalSystem(id, req.body);
      if (!updatedSystem) {
        return res.status(500).json({ message: "Failed to update political system" });
      }
      
      res.json(updatedSystem);
    } catch (error: any) {
      console.error(`Error updating political system:`, error);
      res.status(400).json({ message: error.message || "Failed to update political system" });
    }
  });

  // Political parties routes
  app.get("/api/countries/:countryId/parties", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const parties = await storage.getPoliticalPartiesByCountryId(countryId);
      res.json(parties);
    } catch (error) {
      console.error(`Error fetching political parties for country ${req.params.countryId}:`, error);
      res.status(500).json({ message: "Failed to fetch political parties" });
    }
  });
  
  app.post("/api/countries/:countryId/parties", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      
      // Check if country exists
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      const data = {
        ...req.body,
        countryId
      };
      
      const validatedData = insertPoliticalPartySchema.parse(data);
      
      const party = await storage.createPoliticalParty(validatedData);
      res.status(201).json(party);
    } catch (error: any) {
      console.error(`Error creating political party:`, error);
      res.status(400).json({ message: error.message || "Failed to create political party" });
    }
  });
  
  app.patch("/api/countries/:countryId/parties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const countryId = parseInt(req.params.countryId);
      
      // Check if country exists
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing party
      const parties = await storage.getPoliticalPartiesByCountryId(countryId);
      const existingParty = parties.find(party => party.id === id);
      
      if (!existingParty) {
        return res.status(404).json({ message: "Political party not found for this country" });
      }
      
      // Update the party
      const updatedParty = await storage.updatePoliticalParty(id, req.body);
      if (!updatedParty) {
        return res.status(500).json({ message: "Failed to update political party" });
      }
      
      res.json(updatedParty);
    } catch (error: any) {
      console.error(`Error updating political party:`, error);
      res.status(400).json({ message: error.message || "Failed to update political party" });
    }
  });
  
  app.delete("/api/countries/:countryId/parties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const countryId = parseInt(req.params.countryId);
      
      // Check if country exists
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing party
      const parties = await storage.getPoliticalPartiesByCountryId(countryId);
      const existingParty = parties.find(party => party.id === id);
      
      if (!existingParty) {
        return res.status(404).json({ message: "Political party not found for this country" });
      }
      
      // Delete the party
      const success = await storage.deletePoliticalParty(id);
      if (!success) {
        return res.status(500).json({ message: "Failed to delete political party" });
      }
      
      res.status(204).end();
    } catch (error: any) {
      console.error(`Error deleting political party:`, error);
      res.status(400).json({ message: error.message || "Failed to delete political party" });
    }
  });

  // Economy routes
  app.get("/api/countries/:countryId/economy", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const economicData = await storage.getEconomicDataByCountryId(countryId);
      
      if (!economicData) {
        return res.status(404).json({ message: "Economic data not found" });
      }
      
      res.json(economicData);
    } catch (error) {
      console.error(`Error fetching economic data for country ${req.params.countryId}:`, error);
      res.status(500).json({ message: "Failed to fetch economic data" });
    }
  });
  
  app.post("/api/countries/:countryId/economy", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const country = await storage.getCountryById(countryId);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      const data = {
        ...req.body,
        countryId,
      };
      
      const validatedData = insertEconomicDataSchema.parse(data);
      
      const economicData = await storage.createEconomicData(validatedData);
      res.status(201).json(economicData);
    } catch (error: any) {
      console.error(`Error creating economic data:`, error);
      res.status(400).json({ message: error.message || "Failed to create economic data" });
    }
  });
  
  app.patch("/api/countries/:countryId/economy/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const countryId = parseInt(req.params.countryId);
      
      // Check if country exists
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Check if economic data exists
      const existingData = await storage.getEconomicDataByCountryId(countryId);
      if (!existingData || existingData.id !== id) {
        return res.status(404).json({ message: "Economic data not found for this country" });
      }
      
      // Process the request body to ensure data is properly formatted
      let processedBody = { ...req.body };
      
      if (processedBody.gdpHistory && Array.isArray(processedBody.gdpHistory)) {
        // Make sure each gdp value is a number
        processedBody.gdpHistory = processedBody.gdpHistory.map((entry: {year: string, gdp: number | string}) => ({
          year: entry.year,
          gdp: typeof entry.gdp === 'string' ? parseFloat(entry.gdp) : entry.gdp
        }));
        
        console.log('Processed GDP history before update:', processedBody.gdpHistory);
      }

      // Handle industry specializations - ensure it's valid JSON
      if (processedBody.industrySpecializations) {
        console.log('Received industry specializations:', processedBody.industrySpecializations);
        if (typeof processedBody.industrySpecializations === 'string') {
          try {
            processedBody.industrySpecializations = JSON.parse(processedBody.industrySpecializations);
          } catch (e) {
            console.error('Failed to parse industry specializations as JSON:', e);
          }
        }
      }

      // Handle trading partners - ensure it's valid JSON
      if (processedBody.tradingPartners) {
        console.log('Received trading partners:', processedBody.tradingPartners);
        if (typeof processedBody.tradingPartners === 'string') {
          try {
            processedBody.tradingPartners = JSON.parse(processedBody.tradingPartners);
          } catch (e) {
            console.error('Failed to parse trading partners as JSON:', e);
          }
        }
      }
      
      const updatedData = await storage.updateEconomicData(id, processedBody);
      if (!updatedData) {
        return res.status(500).json({ message: "Failed to update economic data" });
      }
      
      res.json(updatedData);
    } catch (error: any) {
      console.error(`Error updating economic data:`, error);
      res.status(400).json({ message: error.message || "Failed to update economic data" });
    }
  });

  // International relations routes
  app.get("/api/countries/:countryId/relations", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const relations = await storage.getInternationalRelationsByCountryId(countryId);
      res.json(relations);
    } catch (error) {
      console.error(`Error fetching international relations for country ${req.params.countryId}:`, error);
      res.status(500).json({ message: "Failed to fetch international relations" });
    }
  });

  app.post("/api/countries/:countryId/relations", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const country = await storage.getCountryById(countryId);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Format the data
      const data = {
        ...req.body,
        countryId,
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
      };
      
      const validatedData = insertInternationalRelationSchema.parse(data);
      
      const relation = await storage.createInternationalRelation(validatedData);
      res.status(201).json(relation);
    } catch (error: any) {
      console.error(`Error creating international relation:`, error);
      res.status(400).json({ message: error.message || "Failed to create international relation" });
    }
  });

  // PATCH for updating international relations
  app.patch("/api/countries/:countryId/relations/:id", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const relationId = parseInt(req.params.id);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing relation to verify ownership
      const existingRelations = await storage.getInternationalRelationsByCountryId(countryId);
      const relation = existingRelations.find(r => r.id === relationId);
      
      if (!relation) {
        return res.status(404).json({ message: "International relation not found for this country" });
      }
      
      // Format the data for update
      const data = {
        ...req.body,
        countryId,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      };
      
      // Update the international relation
      const updatedRelation = await storage.updateInternationalRelation(relationId, data);
      if (!updatedRelation) {
        return res.status(500).json({ message: "Failed to update international relation" });
      }
      
      res.json(updatedRelation);
    } catch (error: any) {
      console.error(`Error updating international relation:`, error);
      res.status(400).json({ message: error.message || "Failed to update international relation" });
    }
  });

  // DELETE for international relations
  app.delete("/api/countries/:countryId/relations/:id", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const relationId = parseInt(req.params.id);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing relation to verify ownership
      const existingRelations = await storage.getInternationalRelationsByCountryId(countryId);
      const relation = existingRelations.find(r => r.id === relationId);
      
      if (!relation) {
        return res.status(404).json({ message: "International relation not found for this country" });
      }
      
      // Delete the international relation
      const deleted = await storage.deleteInternationalRelation(relationId);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete international relation" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting international relation:`, error);
      res.status(500).json({ message: "Failed to delete international relation" });
    }
  });

  // Historical laws routes
  app.get("/api/countries/:countryId/laws", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const laws = await storage.getHistoricalLawsByCountryId(countryId);
      res.json(laws);
    } catch (error) {
      console.error(`Error fetching historical laws for country ${req.params.countryId}:`, error);
      res.status(500).json({ message: "Failed to fetch historical laws" });
    }
  });

  app.post("/api/countries/:countryId/laws", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const country = await storage.getCountryById(countryId);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Format the data
      const data = {
        ...req.body,
        countryId,
        // Use date as a string without conversion
        date: req.body.date || null,
      };
      
      const validatedData = insertHistoricalLawSchema.parse(data);
      
      const law = await storage.createHistoricalLaw(validatedData);
      res.status(201).json(law);
    } catch (error: any) {
      console.error(`Error creating historical law:`, error);
      res.status(400).json({ message: error.message || "Failed to create historical law" });
    }
  });

  // PATCH for updating historical laws
  app.patch("/api/countries/:countryId/laws/:id", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const lawId = parseInt(req.params.id);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing law to verify ownership
      const existingLaws = await storage.getHistoricalLawsByCountryId(countryId);
      const law = existingLaws.find(l => l.id === lawId);
      
      if (!law) {
        return res.status(404).json({ message: "Historical law not found for this country" });
      }
      
      // Format the data for update
      const data = {
        ...req.body,
        countryId,
        // Use date as a string without conversion
        date: req.body.date || undefined,
      };
      
      // Update the historical law
      const updatedLaw = await storage.updateHistoricalLaw(lawId, data);
      if (!updatedLaw) {
        return res.status(500).json({ message: "Failed to update historical law" });
      }
      
      res.json(updatedLaw);
    } catch (error: any) {
      console.error(`Error updating historical law:`, error);
      res.status(400).json({ message: error.message || "Failed to update historical law" });
    }
  });

  // DELETE for historical laws
  app.delete("/api/countries/:countryId/laws/:id", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const lawId = parseInt(req.params.id);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing law to verify ownership
      const existingLaws = await storage.getHistoricalLawsByCountryId(countryId);
      const law = existingLaws.find(l => l.id === lawId);
      
      if (!law) {
        return res.status(404).json({ message: "Historical law not found for this country" });
      }
      
      // Delete the historical law
      const deleted = await storage.deleteHistoricalLaw(lawId);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete historical law" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting historical law:`, error);
      res.status(500).json({ message: "Failed to delete historical law" });
    }
  });

  // Statistics routes
  app.get("/api/countries/:countryId/statistics", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const statistics = await storage.getStatisticsByCountryId(countryId);
      res.json(statistics);
    } catch (error) {
      console.error(`Error fetching statistics for country ${req.params.countryId}:`, error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.post("/api/countries/:countryId/statistics", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const country = await storage.getCountryById(countryId);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Format the data
      const data = {
        ...req.body,
        countryId,
        year: req.body.year ? parseInt(req.body.year) : null,
        data: req.body.data || [],
      };
      
      const validatedData = insertStatisticSchema.parse(data);
      
      const statistic = await storage.createStatistic(validatedData);
      res.status(201).json(statistic);
    } catch (error: any) {
      console.error(`Error creating statistic:`, error);
      res.status(400).json({ message: error.message || "Failed to create statistic" });
    }
  });

  // PATCH for updating statistics
  app.patch("/api/countries/:countryId/statistics/:id", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const statisticId = parseInt(req.params.id);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing statistic to verify ownership
      const existingStatistics = await storage.getStatisticsByCountryId(countryId);
      const statistic = existingStatistics.find(s => s.id === statisticId);
      
      if (!statistic) {
        return res.status(404).json({ message: "Statistic not found for this country" });
      }
      
      // Format the data for update
      const data = {
        ...req.body,
        countryId,
        year: req.body.year ? parseInt(req.body.year) : undefined,
        data: req.body.data || undefined,
      };
      
      // Update the statistic
      const updatedStatistic = await storage.updateStatistic(statisticId, data);
      if (!updatedStatistic) {
        return res.status(500).json({ message: "Failed to update statistic" });
      }
      
      res.json(updatedStatistic);
    } catch (error: any) {
      console.error(`Error updating statistic:`, error);
      res.status(400).json({ message: error.message || "Failed to update statistic" });
    }
  });

  // DELETE for statistics
  app.delete("/api/countries/:countryId/statistics/:id", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const statisticId = parseInt(req.params.id);
      
      // Fetch the country
      const country = await storage.getCountryById(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      // Get existing statistic to verify ownership
      const existingStatistics = await storage.getStatisticsByCountryId(countryId);
      const statistic = existingStatistics.find(s => s.id === statisticId);
      
      if (!statistic) {
        return res.status(404).json({ message: "Statistic not found for this country" });
      }
      
      // Delete the statistic
      const deleted = await storage.deleteStatistic(statisticId);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete statistic" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting statistic:`, error);
      res.status(500).json({ message: "Failed to delete statistic" });
    }
  });

  // Delete duplicate routes - already defined above

  return createServer(app);
}