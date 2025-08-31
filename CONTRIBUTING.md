# Contributing to Shopra Monorepo

Thank you for your interest in contributing to **Shopra Monorepo**! This document provides comprehensive guidelines for contributing code, documentation, tests, and improvements. Please read carefully before opening issues, creating branches, or submitting pull requests.

---

## Table of Contents

1. [Project Philosophy](#project-philosophy)
2. [Branching Strategy](#branching-strategy)
3. [Commit Message Guidelines](#commit-message-guidelines)
4. [Contribution Workflow](#contribution-workflow)
5. [Code Quality Standards](#code-quality-standards)
6. [Pull Request Guidelines](#pull-request-guidelines)
7. [Issue Reporting](#issue-reporting)
8. [Release Process](#release-process)
9. [Community & Communication](#community--communication)
10. [License](#license)

---

## Project Philosophy

Shopra is a community-driven, modular SaaS marketplace platform. We value:

- **Clean, maintainable code**
- **Automated testing and CI/CD**
- **Clear documentation**
- **Respectful, inclusive collaboration**
- **Continuous improvement**

---

## Branching Strategy

We use a **Gitflow-inspired branching model** for consistency and reliability:

- **`main`**: Production-ready code. No direct commits. Only merges from `develop` or `hotfix/*`.
- **`develop`**: Main integration branch. All feature, bugfix, and enhancement branches merge here. Should always be stable and deployable.
- **Feature Branches** (`feature/<feature-name>`): For new features. Branch from `develop`. Use kebab-case. Example: `feature/user-profile-editing`.
- **Bugfix Branches** (`bugfix/<bug-description>`): For bug fixes. Branch from `develop`. Example: `bugfix/login-button-not-working`.
- **Hotfix Branches** (`hotfix/<hotfix-description>`): For urgent production fixes. Branch from `main`. Merge into both `main` and `develop`. Example: `hotfix/payment-gateway-timeout`.
- **Enhancement Branches** (`enhancement/<enhancement-name>`): For improvements. Branch from `develop`. Example: `enhancement/improve-search-performance`.

---

## Commit Message Guidelines

We follow **[Conventional Commits](https://www.conventionalcommits.org/)** for clarity and automation.

**Format:**

```
<type>(<scope>): <description>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, whitespace, no logic changes
- `refactor`: Code change not fixing a bug or adding a feature
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `build`: Build system or dependency changes
- `ci`: CI configuration or scripts
- `chore`: Other changes not affecting `src` or `test`

### Scope

Scope is optional but encouraged. Use the service, app, or library name (e.g., `svc-auth`, `web`, `libs/ui`).

### Examples

```
feat(svc-product): add product recommendation API endpoint
fix(web): correct issue with product filter component
refactor(libs/kafka-client): improve Kafka connection logic
docs(README): add contribution guidelines
```

---

## Contribution Workflow

1. **Fork the Repository**
   - Fork to your GitHub account.
2. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/shopra-monorepo.git
   cd shopra-monorepo
   ```
3. **Create a New Branch**
   - Always branch from `develop` unless creating a hotfix.
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-user-auth-flow
   ```
4. **Make Changes**
   - Write clean, maintainable code.
   - Cover your code with unit/e2e tests.
   - Follow coding standards (ESLint, Prettier, Husky hooks).
   - Update documentation as needed.
5. **Commit Changes**
   - Use Conventional Commits format.
   ```bash
   git add .
   git commit -m "feat(svc-auth): implement Google OAuth"
   ```
6. **Push Changes**
   ```bash
   git push origin feature/new-user-auth-flow
   ```
7. **Open a Pull Request**
   - Target branch: `develop` (unless hotfix)
   - Provide a clear title and description
   - Link relevant issues (e.g., `Closes #42`)
8. **Review & Merge**
   - All PRs must pass CI (lint, tests, type checks)
   - At least one code review approval required
   - PRs merged into `develop` after approval

---

## Code Quality Standards

- **Linting & Formatting**: All code must pass ESLint and Prettier checks
- **Testing**: New features/fixes must include unit and e2e tests
- **Type Safety**: Strict TypeScript types
- **Documentation**: Update docs for new features/changes
- **Modularity**: Keep code modular and maintainable

---

## Pull Request Guidelines

- Keep PRs focused and small
- Include a description of what and why you changed
- Link relevant issues
- Ensure your branch is up to date with `develop` before review
- Add yourself to the CONTRIBUTORS section in README if it's your first PR

---

## Issue Reporting

When opening issues, please include:

- Clear, descriptive title
- Steps to reproduce (if bug)
- Expected vs actual behavior
- Relevant screenshots/logs (if applicable)
- Suggested solutions or context

---

## Release Process

- Regular merges into `develop`
- When ready for release, `develop` is merged into `main`
- Release notes and version tags generated from commit history
- Hotfixes merged directly into `main` and then back into `develop`

---

## Community & Communication

- Be respectful and inclusive
- Use clear, constructive feedback in reviews
- Join discussions in issues and PRs
- For major changes, open a discussion issue first
- See the README for contributor recognition

---

## License

By contributing, you agree your contributions are licensed under the repository’s [MIT License](./LICENSE).

---
