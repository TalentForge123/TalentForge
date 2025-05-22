import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createClient } from '@/lib/airtable';

// API handler for client-specific data
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user session
    const session = await getServerSession(req, res, authOptions);
    
    // Check authentication
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get client ID from session
    const clientId = session.user.clientId || session.user.email;
    
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID not found' });
    }

    // Create Airtable client
    const airtableClient = createClient();
    
    // Fetch client-specific data with filtering
    const employeesPromise = airtableClient.getData('employees', {
      filterByFormula: `{clientId} = '${clientId}'`,
      maxRecords: 100,
    }).catch(() => ({ records: [] }));
    
    const jobsPromise = airtableClient.getData('jobs', {
      filterByFormula: `{clientId} = '${clientId}'`,
      maxRecords: 100,
    }).catch(() => ({ records: [] }));
    
    const candidatesPromise = airtableClient.getData('candidates', {
      filterByFormula: `{clientId} = '${clientId}'`,
      maxRecords: 100,
    }).catch(() => ({ records: [] }));
    
    // Wait for all promises to resolve
    const [employees, jobs, candidates] = await Promise.all([
      employeesPromise,
      jobsPromise,
      candidatesPromise
    ]);
    
    // Format data for client
    const formatRecords = (records) => {
      return records.map(record => record.fields);
    };
    
    // Return client data
    return res.status(200).json({
      data: {
        employees: formatRecords(employees.records || []),
        jobs: formatRecords(jobs.records || []),
        candidates: formatRecords(candidates.records || [])
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
