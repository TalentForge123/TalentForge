import { createClient } from '@/lib/airtable';

// Airtable API handler
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tableName, records } = req.body;
    
    if (!tableName || !records) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create Airtable client using environment variables
    const airtableClient = createClient();
    
    // Send data to Airtable
    const result = await airtableClient.sendData(tableName, records);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
