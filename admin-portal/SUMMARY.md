# Fetadify Admin Portal (Standalone)

This is the standalone admin portal for the Fetadify AI Innovation Hub. It has
been extracted from the main project to allow for independent deployment.

## Key Features

- **Project Management**: Control your showcase portfolio.
- **Service Management**: Define your offerings with custom pricing toggles.
- **Subscriber Registry**: Manage your newsletter and broadcast pulses.
- **Booking Hub**: Track client requests and project specifications (including
  PDF uploads).
- **Invoice & Support**: integrated management tools.

## Deployment Instructions

1. **Build**: Run `npm run build` in this directory.
2. **Upload**: Upload the `dist/` folder contents to your dedicated admin server
   or subdomain (e.g., `admin.fetadify.com`).
3. **Environment**: Ensure the `.env` file contains the correct
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. **Routing**: A `.htaccess` file is included in the `public` folder to
   facilitate SPA routing on Apache/CPanel.

## Technical Details

- Built with Vite, React, and Tailwind CSS.
- Integrated with Supabase for data and storage.
- Reuses shared UI components from the main Fetadify ecosystem.
