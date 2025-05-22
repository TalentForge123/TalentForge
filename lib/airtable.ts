// Secure Airtable client for server-side use
import Airtable from 'airtable';

// Configuration from environment variables
const AIRTABLE_CONFIG = {
  baseId: process.env.AIRTABLE_BASE_ID,
  token: process.env.AIRTABLE_TOKEN,
  tables: {
    candidates: process.env.AIRTABLE_CANDIDATES_TABLE,
    employees: process.env.AIRTABLE_EMPLOYEES_TABLE,
    jobs: process.env.AIRTABLE_JOBS_TABLE
  }
};

// Create Airtable client
export function createClient() {
  // Validate environment variables
  if (!AIRTABLE_CONFIG.baseId || !AIRTABLE_CONFIG.token) {
    throw new Error('Missing required Airtable configuration');
  }

  // Initialize Airtable with token
  const base = new Airtable({ apiKey: AIRTABLE_CONFIG.token }).base(AIRTABLE_CONFIG.baseId);

  return {
    // Send data to Airtable
    async sendData(tableName, records) {
      const tableId = AIRTABLE_CONFIG.tables[tableName];
      
      if (!tableId) {
        throw new Error(`Table "${tableName}" not configured`);
      }

      try {
        const table = base(tableId);
        const result = await table.create(records);
        return { success: true, records: result };
      } catch (error) {
        console.error('Airtable error:', error);
        throw error;
      }
    },

    // Get data from Airtable
    async getData(tableName, options = {}) {
      const tableId = AIRTABLE_CONFIG.tables[tableName];
      
      if (!tableId) {
        throw new Error(`Table "${tableName}" not configured`);
      }

      try {
        const table = base(tableId);
        let query = table.select(options);
        const records = await query.all();
        return { records };
      } catch (error) {
        console.error('Airtable error:', error);
        throw error;
      }
    }
  };
}

// Client-side safe version (no token exposure)
export function createClientSideConfig() {
  return {
    tables: {
      candidates: process.env.NEXT_PUBLIC_AIRTABLE_CANDIDATES_TABLE || 'candidates',
      employees: process.env.NEXT_PUBLIC_AIRTABLE_EMPLOYEES_TABLE || 'employees',
      jobs: process.env.NEXT_PUBLIC_AIRTABLE_JOBS_TABLE || 'jobs'
    }
  };
}
