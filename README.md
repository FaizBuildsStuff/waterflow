# Waterflow

AI-powered productivity SaaS for agencies. Work that flows like water.

## Tech Stack

- **Framework**: Next.js 16.2.0 (App Router, Turbopack)
- **Database**: PostgreSQL (NeonDB)
- **Auth**: Custom JWT with `jose` (Edge-compatible)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **AI**: OpenAI (ChatGPT API - GPT-4o mini)
- **Animations**: GSAP + ScrollTrigger
- **DND**: `@dnd-kit` for interactive boards

## Key Features

- **Collaborative Workspaces**: Invite team members and share projects in real-time.
- **Slug-based URLs**: Clean, readable project paths (e.g., `/projects/website-redesign`).
- **Multi-View Dashboard**: Switch between Kanban, List, Timeline, and Wireframe views.
- **AI Task Mastery**: Generate subtasks and comprehensive descriptions directly with AI.
- **Unified "My Tasks"**: See all your assignments across multiple projects in one place.
- **Live Roadmap & Polling**: Timeline views with real-time sync and live UI updates across users.
- **Task Discussions**: Integrated commenting system for seamless team communication.
- **Collaborative Wireframing**: Generate and iterate on UI wireframes directly in the project dashboard.
- **Professional Agency Theme**: High-contrast dark mode with glassmorphism and modern typography.

## Getting Started

### Prerequisites

- Node.js 18+
- NeonDB Database (PostgreSQL)
- OpenAI API Key
- JWT_SECRET

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/waterflow.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   DATABASE_URL="your-neondb-url"
   JWT_SECRET="your-secret"
   CHATGPT_API="your-openai-key"
   ```
4. Run the development server (Turbopack):
   ```bash
   npm run dev
   ```
