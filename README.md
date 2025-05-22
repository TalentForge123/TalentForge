# TalentForge Static Landing Page

This is a simplified static version of the TalentForge landing page with client-side Airtable integration for data uploads.

## Features

- Responsive landing page for TalentForge
- Client-side Airtable integration for data uploads
- Sample templates for employee, job, and candidate data
- Upload history tracking

## Deployment

This static site is configured for easy deployment on Vercel:

1. Push this directory to a GitHub repository
2. Connect the repository to Vercel
3. Deploy with default settings

No environment variables or server-side configuration is required for this simplified version.

## Airtable Integration

The Airtable integration is handled client-side through the `airtable-integration.js` file, which includes:

- Direct API calls to Airtable using the personal access token
- CSV parsing and data formatting
- Error handling and response processing

## Future Enhancements

This simplified version can be expanded later to include:

- User authentication with NextAuth
- Server-side Airtable integration
- Advanced analytics and reporting features
