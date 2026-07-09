# BoDesk

An AI-powered case management system for property management companies. Tenants email the property manager's regular support inbox — the platform handles the rest automatically.

When a tenant sends an email, Claude classifies the issue, asks structured follow-up questions, and collects all necessary information through a natural email conversation. Once the case is complete, a human agent reviews and approves it through the dashboard CRM.

## How It Works

```
Tenant email
    → Postmark inbound webhook
        → AI classifies issue & identifies missing fields
            → Reply sent from property manager's real Gmail address
                → Repeat until all fields collected
                    → Dashboard: agent reviews, approves, forwards to contractor
```

The tenant never interacts with the platform UI. The dashboard is exclusively for property company staff.

## Live Testing

The system was tested end-to-end with real email accounts and worked successfully:

- Forwarding rules were set up on a real Gmail account to route incoming tenant mail to Postmark
- Postmark delivered the emails to the local webhook via ngrok
- Claude correctly classified issues, asked follow-up questions, and collected structured data across multi-turn email conversations
- Replies arrived in the tenant's inbox from the property manager's real Gmail address via OAuth2 — with no sign of a platform involved
- The full case lifecycle was completed successfully: collecting information → waiting for resident → ready for review → approved → forwarded to contractor

## Features

- **AI email handling** — Claude reads incoming mail, classifies it, and asks follow-up questions in Swedish until all required information is collected
- **Configurable issue categories** — admins define categories (e.g. water leak, broken heating) and the specific fields the AI should collect per category
- **Gmail OAuth2 integration** — replies are sent from the property manager's real address; tenants see no sign of a platform
- **Escalation detection** — aggressive or threatening tone triggers immediate escalation to a human agent, skipping further AI conversation
- **Review deck** — card-based UI for agents to approve ready cases and forward them to the right contractor
- **Contractor routing** — fuzzy-matched by category, manually overridable per case
- **GDPR-aware** — closed and archived cases are automatically deleted after 90 days
- **Timeout handling** — cases with no tenant response are archived after 7 days

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma 7 (Railway) |
| Auth | NextAuth v5 (credentials + JWT) |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| Email sending | Gmail API (OAuth2) |
| Email receiving | Postmark inbound webhook |
| Styling | Tailwind CSS v4 |
| Deployment | Railway |

## Architecture

### Database schema

- `Company` → `Property` → `Case` (hierarchy)
- `IssueCategory` + `CategoryField` — configurable per company, drives what the AI collects
- `CaseFieldValue` — structured answers attached to each case
- `EmailAccount` — Gmail OAuth2 tokens per company
- `Message` — full email history per case

### Case status flow

```
COLLECTING_INFORMATION → WAITING_FOR_RESIDENT
                      → READY_FOR_REVIEW
                      → ESCALATED

IN_PROGRESS → CLOSED
WAITING_FOR_RESIDENT → ARCHIVED (7 days)
CLOSED / ARCHIVED → deleted after 90 days (GDPR)
```

### AI integration

Claude is called once per incoming email and returns structured JSON covering:
1. Escalation decision (aggressive tone detection)
2. Issue category classification
3. Field extraction from email body
4. Which required fields are still missing
5. Next reply message in Swedish (or escalation notice)

Prompt caching is used on the system prompt to reduce latency and cost across multi-turn conversations.

## Local Setup

```bash
cp .env.example .env   # fill in all values
npm install
npm run db:migrate
npm run dev
```

For inbound email testing locally: configure Postmark to deliver to a public URL (e.g. via ngrok), set up a Gmail forwarding rule to your Postmark intake address.

## What I Learned

- Building a multi-turn AI workflow driven by structured JSON output
- Gmail API and OAuth2 token lifecycle (refresh, storage, expiry)
- Email threading via `In-Reply-To` / `References` headers (RFC 2822)
- Webhook idempotency — why returning 200 even on processing errors matters
- Prisma 7 with WASM adapter and PostgreSQL on Railway
- NextAuth v5 with custom JWT claims (role, companyId)
- Prompt engineering for information extraction and tone detection

## Status

Working prototype, tested with real email accounts. Built as a first-year university project to explore practical AI applications and full-stack engineering.
