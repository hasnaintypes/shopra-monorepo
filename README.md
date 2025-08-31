# Shopra Monorepo

> **Shopra** a multi-tenant SaaS marketplace platform built with a modular **monorepo** architecture.  
> Developed and maintained by [@hasnaintypes](https://github.com/hasnaintypes).

---

## Project Overview

Shopra is a **modern multi-tenant e-commerce SaaS platform** designed to empower independent sellers while offering a seamless shopping experience to end-users. The project adopts a **microservices architecture** with **Next.js frontends** for different stakeholders and **NestJS services** for the backend.

It enables sellers to create and manage their stores independently, users to shop across a dynamic marketplace, and administrators to monitor and manage the ecosystem efficiently.

---

## Core Features

- **Multi-Tenant SaaS Model**  
  Independent sellers onboard, list products, manage inventory, and fulfill orders.

- **Personalized Shopping Experience**  
  Real-time recommendations powered by **TensorFlow**.

- **Real-Time Chat**  
  WebSocket-based communication between sellers and customers.

- **Event-Driven Microservices**  
  Asynchronous communication powered by **Kafka**.

- **Scalable Infrastructure**  
  Built with **NestJS microservices**, **MongoDB**, and **Redis caching**.

- **Role-Based Access Control**  
  Sellers, users, and admins operate via dedicated frontends with centralized authentication.

---

## Tech Stack

### Frontend

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-000000?style=flat)](https://ui.shadcn.com/)

### Backend

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Kafka](https://img.shields.io/badge/Kafka-231F20?style=flat&logo=apache-kafka&logoColor=white)](https://kafka.apache.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)

### Infrastructure & Tooling

[![PNPM](https://img.shields.io/badge/pnpm-000000?style=flat&logo=pnpm&logoColor=yellow)](https://pnpm.io/)
[![NX](https://img.shields.io/badge/NX-143055?style=flat&logo=nx&logoColor=white)](https://nx.dev/)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

---

## Monorepo Structure

The repository follows a **pnpm workspace monorepo** structure with separation between apps, backend services, and shared libraries.

```

shopra-monorepo/
├── apps/
│   ├── web/              # Next.js app — User/Customer-facing UI
│   ├── seller-portal/    # Next.js app — Seller dashboard
│   ├── admin-panel/      # Next.js app — Admin dashboard
│
├── services/
│   ├── api-gateway/      # NestJS API Gateway
│   ├── svc-auth/         # Authentication & authorization
│   ├── svc-product/      # Product management service
│   ├── svc-order/        # Order processing & fulfillment
│   ├── svc-recommendation/ # TensorFlow-powered recommendations
│   ├── svc-chat/         # Real-time WebSocket chat
│   ├── svc-user/         # User profile management
│   ├── svc-notifications/ # Notifications (push/email)
│
├── libs/
│   ├── ui/               # Shared UI components (Shadcn wrappers, design system)
│   ├── shared-types/     # Common TypeScript types & interfaces
│   ├── kafka-client/     # Reusable Kafka producer/consumer
│   ├── logging-lib/      # Centralized logging utility
│   ├── prisma-client/    # Centralized Prisma client
│
├── .github/              # GitHub workflows (CI/CD)
├── .husky/               # Git hooks (Prettier, linting, tests)
├── .vscode/              # Recommended settings & extensions
├── nx.json               # NX configuration
├── package.json
├── pnpm-workspace.yaml   # PNPM workspace configuration
├── tsconfig.json
└── README.md

```

---

## Architectural Principles

- **Domain-Driven Design (DDD)**: Each service encapsulates a specific domain (auth, product, order, etc.).
- **Microservices**: Services are loosely coupled and communicate via Kafka events.
- **Event-Driven**: Kafka ensures reliable, asynchronous communication across services.
- **Separation of Concerns**: Apps (UI), services (backend), and libs (shared code) are modular and independently deployable.
- **Scalability**: Each service can be scaled independently based on load.

---

## Kafka Event Flows

- **OrderCreated → Product Service**: Update inventory asynchronously.
- **OrderCreated → Notifications Service**: Send push/email notifications.
- **ProductViewed / ProductPurchased → Recommendation Service**: Update recommendation models in real-time.
- **Chat Messages → Notifications Service**: Notify participants of new messages.

---

## Next.js App Structure

Each app (`web`, `seller-portal`, `admin-panel`) follows the App Router with **feature-based modularity**.

```

/apps/web/
├── src/
│   ├── app/          # Next.js App Router (public/protected routes)
│   ├── components/   # Reusable components
│   ├── lib/          # Client utilities & hooks
│   ├── styles/       # Global & theme styles
├── public/           # Static assets

```

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/hasnaintypes/shopra-monorepo.git
cd shopra-monorepo
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create `.env` files for apps and services.
See **[Environment Setup](#-environment-variables)** for details.

### 4. Run Development Servers

```bash
pnpm dev
```

---

## Deployment

- **Frontend Apps**: Deployable on Vercel, Netlify, or Docker.
- **Backend Services**: Deployable on Kubernetes, Docker Swarm, or standalone containers.
- **CI/CD**: GitHub Actions workflows handle build, linting, testing, and deployment pipelines.

---

## Environment Variables

Each service and app requires environment configuration.
Define variables in `.env` files (not included in the repo).

> **Sections to add later:**

- API Gateway
- Authentication Service
- Product Service
- Order Service
- Recommendation Service
- Chat Service
- Notifications Service
- Frontend Apps (`web`, `seller-portal`, `admin-panel`)

---

## Testing

- **Unit Tests**: Each service has a `test/unit` folder.
- **E2E Tests**: Located in `test/e2e` inside services.
- **CI Integration**: Tests run automatically in GitHub Actions.

---

## Roadmap

- [ ] Multi-currency support
- [ ] Multi-language support
- [ ] Analytics dashboard for sellers
- [ ] AI-powered fraud detection

---

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Submit a Pull Request

---

## License

[MIT](./LICENSE) © [@hasnaintypes](https://github.com/hasnaintypes)

---
