import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createClient } from '@/lib/airtable';

// API handler for shared data
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

    // Create Airtable client
    const airtableClient = createClient();
    
    // Fetch shared data
    const employeesPromise = airtableClient.getData('employees', {
      filterByFormula: `{isShared} = '1'`,
      maxRecords: 100,
    }).catch(() => ({ records: [] }));
    
    const jobsPromise = airtableClient.getData('jobs', {
      filterByFormula: `{isShared} = '1'`,
      maxRecords: 100,
    }).catch(() => ({ records: [] }));
    
    const candidatesPromise = airtableClient.getData('candidates', {
      filterByFormula: `{isShared} = '1'`,
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
    
    // Return shared data
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
