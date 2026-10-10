# Feel The Dance Studio

A responsive dance academy website and admin management UI built with React, TypeScript, Vite, React Router, Tailwind CSS, and Supabase-ready architecture.

## Features

- Public-facing website with homepage, classes, gallery, contact, admission, and trial-booking pages.
- Owner management at `/admin` with a first-use account setup, protected routes, student registration, monthly fee ledger, payment records, and printable receipts.
- WhatsApp fee reminders with the guardian's number and outstanding balance pre-filled for owner review and sending.
- Public `/pay-now` page with owner-managed UPI QR/ID, UPI-app launch, and WhatsApp payment-confirmation shortcut.
- Shared validation utilities and reusable UI building blocks.
- Demo content and secure implementation boundaries for Supabase, RLS, and reminder automation.

## Local development

1. Install dependencies:
   `npm install`
2. Start the dev server:
   `npm run dev`
3. Build for production:
   `npm run build`

## Environment variables

Copy `.env.example` and fill the values for your project:

```bash
cp .env.example .env.local
```

## Security and external integrations

This project is structured to use Supabase Auth + PostgreSQL with a private `service_role` only on trusted server-side code. Do not expose secrets in the frontend. The public site must never access private student or fee records.

Required external services:

- Supabase project
- Supabase Auth for admin login
- PostgreSQL + RLS for protected data
- Optional WhatsApp Business API / SMS provider
- Optional scheduler (Supabase cron / Edge Functions or another server-side scheduler)

Automatic WhatsApp delivery before month-end is intentionally not simulated by the browser UI. It needs a WhatsApp Business Platform provider, a trusted server-side function, and a scheduler; never put provider credentials in frontend environment variables.

## Local owner management

1. Open `/admin/login`.
2. On first use in a browser, create the owner email and password.
3. Add students, their guardian's WhatsApp number, class, and monthly fee from the owner dashboard.
4. Record payments in the dashboard. Each payment updates the monthly balance and provides a printable / Save as PDF receipt.
5. For unpaid fees, choose WhatsApp to open a pre-filled reminder. Review and send it in WhatsApp.
6. Open `/admin/payment-settings` (or select Payment setup in the dashboard), add the studio UPI ID, upload the payment QR, and enter the admin WhatsApp number. The public website then shows Pay Now and WhatsApp shortcuts.

The current owner workflow is a local demo: login configuration and student/payment data are stored in that browser only. It is not secure for public production deployment and does not synchronize across devices.
The UPI flow opens an app / displays a QR, but does not verify transfers or automatically mark student fees as paid. Admin confirmation is still required. A shared production QR and WhatsApp number require serving settings from a secure shared backend.

## Deployment

- Frontend on Vercel.
- Supabase for data and auth.
- Edge Functions or another server-side job runner for reminder processing.

## Notes

The sample academy data in the app is clearly demo content and should be replaced with live settings in a real deployment.

Homepage registration popup dance video:

- “Baganda traditional dance 01” by Kateregga1, adapted as a 240p WebM for this site.
- Source: https://commons.wikimedia.org/wiki/File:Baganda_traditional_dance_01.webm
- License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
