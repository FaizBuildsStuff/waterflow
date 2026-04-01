# Waterflow: High-Performance Agency Operating System
**Single Source of Truth (SSOT) & Technical Blueprint**

> [!NOTE]
> This document remains the authoritative reference for the Waterflow architecture, intelligence layer, and design philosophy. It is updated following every major feature initialization.

---

## 1. Executive Summary
**Waterflow** is a premium, AI-native productivity platform engineered for elite agencies. It eliminates administrative friction through **Recursive Decomposition** (AI-driven task breaking) and **Fluid Workspace Coordination**. 

The platform's philosophy is "Continuous Flow" — removing the cognitive load of project organization so high-value teams can stay in creative and strategic execution.

---

## 2. Elite Features Table (Current Build)

| Cluster | Intelligence & Governance |
| :--- | :--- |
| **Intelligence Engine** | Automated subtask generation, AI-generated descriptions, and smart roadmap digests (GPT-4o Mini). |
| **Governance Hub** | High-fidelity role management with hex-color identity and secure ownership transfer protocols. |
| **Multi-View Engine** | Integrated Kanban, dense List, GSAP Roadmap, and AI-assisted Wireframe Studio. |
| **Agency Branding** | High-contrast glassmorphism UI, Satoshi-prime typography, and GSAP micro-animations. |

---

## 3. Core Architecture & Tech Stack

### 💾 Backend & Infrastructure
- **Framework**: Next.js 16.2.0 (App Router) using **Turbopack** for rapid development execution.
- **Database**: Neon Serverless PostgreSQL, utilizing high-efficiency `postgres-js` for sub-millisecond edge queries.
- **Authentication**: Custom JWT-based session management (`jose`) with HttpOnly cookie persistence for top-tier security.
- **Edge Compliance**: Auth and API layers are built for global edge compatibility.

### 🎨 Design & Sensory Layer
- **Aesthetic**: "Billion Dollar Agency" — Dark, high-contrast, liquid glass UI.
- **Motion**: **GSAP 3.12+** for all page transitions, header parallax, and element entrance animations.
- **Typography**: **Satoshi** (401 Regular, 500 Medium, 700 Bold) — The definitive agency-grade typeface.
- **UI System**: Tailwind CSS v4 + Radix-based **Shadcn/UI** (Custom Refined Overlays).

---

## 4. Key Design Decisions & Philosophies

### **The "Water" Motif**
Water represents clarity, momentum, and the path of least resistance. Every UI element in Waterflow (buttons, badges, transitions) uses soft-radii, translucency, and fluid animations to reinforce this psychological state of "flow."

### **Security-First Hierarchy**
Ownership is sovereign. Project management follows a strict hierarchy where only the current **Owner** can transfer leadership. Upon transfer, former owners are automatically demoted to "Member" to preserve administrative integrity.

### **Permission-Local Custom Roles**
To maintain clean global workspaces, custom roles are **project-scoped**. This allows agencies to define unique structures (e.g., "Lead Editor" vs. "Production Designer") for individual client projects without cluttering the global organization.

---

## 5. Directory Structure & Source Mapping

```bash
waterflow/
├── app/
│   ├── (auth)/             # Secure Login & Identity protocols
│   ├── (dashboard)/        # Main Agency Workspace and Project Engines
│   ├── api/                # High-performance Next.js API Routes (RESTful)
│   │   ├── ai/             # Intelligence endpoints (OpenAI Integration)
│   │   ├── projects/       # Lifecycle & Roles management
│   │   └── tasks/          # Core task orchestration
├── components/             # Reusable UI Architecture
├── lib/                    # Shared core logic (DB client, Auth handlers)
├── public/                 # Assets and Global Styles
└── context.md              # ✅ You are here
```

---

## 6. Intelligence Protocol (AI)
Waterflow utilizes OpenAI `gpt-4o-mini` for all standard recursive tasks:
1. **Recursive Task Breakdown**: Analyzes a goal and returns an optimized JSON structure of subtasks.
2. **Contextual Descriptors**: Injects professional agency-grade language into task scopes.
3. **Daily Synergist (Planned)**: Predictive analysis of project roadblocks and delivery dates.

---

## 7. Operational Guidelines for AI Assistants
When contributing to the Waterflow codebase, adhere to these "Elite Standards":
- **Typography**: Never use system fonts. Always use Satoshi.
- **Colors**: Standardize on high-contrast dark tokens (`#0A0A0A` page bg, `#0D0D0D` surfaces, `#1a7fe0` primary).
- **Animations**: Entrance animations must use **GSAP**. Never rely solely on CSS transitions for critical UI elements.
- **Response Geometry**: All new UI components must be responsive-first and maintain a "billion-dollar feel" through generous padding and glassmorphic borders.

---
*Last Refined: 2026-04-02*
*System Status: Elite Agency Ready*