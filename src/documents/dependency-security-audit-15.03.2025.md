
# Dependency Security Audit Report (15.06.2025)

## 1. Full Audit of Frontend Dependencies

### Main Dependencies (`dependencies`)

| Package                   | Version  | Status  | Verification Methods                          | Notes                                                   |
|--------------------------|----------|---------|-----------------------------------------------|----------------------------------------------------------|
| react                    | 19.0.0   | Secure  | npm audit, Snyk, GitHub Advisories            | Official stable release                                 |
| react-dom                | 19.0.0   | Secure  | npm audit, Snyk, GitHub Advisories            | Matches React version                                   |
| @reduxjs/toolkit         | 2.2.1    | Secure  | npm audit, Snyk, Socket.dev                   | Official Redux package                                  |
| react-redux              | 9.1.0    | Secure  | npm audit, Snyk, GitHub Advisories            | Used with Redux Toolkit                                 |
| react-router-dom         | 6.22.3   | Secure  | npm audit, Snyk, Socket.dev                   | Well-maintained routing library                         |
| react-hook-form          | 7.56.0   | Secure  | npm audit, Snyk, GitHub Advisories            | Popular and widely used                                 |
| zod                      | 3.25.51  | Secure  | npm audit, Snyk, GitHub Advisories            | Type-safe validation                                    |
| @radix-ui/*              | ~1.3–2.2 | Secure  | npm audit, Snyk, GitHub Advisories            | Accessible and well-maintained UI components            |
| lucide-react             | 0.511.0  | Secure  | npm audit, Snyk, GitHub Advisories            | SVG icon library, no external deps                      |
| tailwindcss              | 4.1.4    | Secure  | npm audit, Snyk, GitHub Advisories            | Modern utility-first styling                            |
| @tailwindcss/vite        | 4.1.4    | Secure  | npm audit, Snyk, GitHub Advisories            | Tailwind integration for Vite                           |
| tailwind-merge           | 3.3.0    | Secure  | npm audit, Snyk, GitHub Advisories            | Prevents Tailwind class conflicts                       |
| class-variance-authority | 0.7.1    | Secure  | npm audit, Snyk, Socket.dev                   | Variant management for Tailwind                         |
| clsx                     | 2.1.1    | Secure  | npm audit, GitHub Advisories, Snyk            | Utility for conditional classNames                      |
| neverthrow               | 8.2.0    | Secure  | npm audit, Snyk, Socket.dev                   | Functional error handling                               |
| @mobily/ts-belt          | 3.13.1   | Secure  | npm audit, GitHub Advisories, Socket.dev      | TypeScript utility belt                                 |

### Dev Dependencies (`devDependencies`)

| Package                 | Version  | Status  | Verification Methods                          |
|------------------------|----------|---------|-----------------------------------------------|
| typescript             | ~5.7.2   | Secure  | npm audit, Snyk, GitHub Advisories            |
| eslint                 | 9.22.0   | Secure  | npm audit, Snyk, GitHub Advisories            |
| @eslint/js             | 9.22.0   | Secure  | npm audit, Snyk, Socket.dev                   |
| typescript-eslint      | 8.26.1   | Secure  | npm audit, GitHub Advisories, Socket.dev      |
| @types/react           | 19.1.2   | Secure  | npm audit, GitHub Advisories                  |
| @types/react-dom       | 19.1.2   | Secure  | npm audit, GitHub Advisories                  |
| @vitejs/plugin-react   | 4.4.1    | Secure  | npm audit, Snyk, Socket.dev                   |
| vite                   | 6.3.2    | Secure  | npm audit, Snyk, GitHub Advisories            |

## 2. Security Compliance

### Verified Standards:

- All dependencies were verified using multiple trusted sources:
  - `npm audit`
  - GitHub Security Advisories
  - [Snyk](https://snyk.io/)
  - [Socket.dev](https://socket.dev/)
- No zero-day vulnerabilities found
- Lock file (`package-lock.json`) is committed to the repository
- No deprecated packages detected

### Secure Development Practices:

- Input validation is handled via **Zod**
- Strong typing is enforced using **TypeScript**
- ESLint ensures code quality and type-safe rules
- No use of `dangerouslySetInnerHTML`, `innerHTML`, or unsafe DOM APIs
- Build process uses **Vite + tsc** and includes linting and type checks
- Automated and manual security checks are in place

## 3. Suggested Dependency Replacement

### Current Library: `clsx`

- Purpose: Conditional className utility
- Limitation: Minimal functionality, lacks support for variants

### Suggested Replacement: `tailwind-variants`

#### Benefits:

- Built on top of `class-variance-authority` (already used)
- Adds support for **variants, states, and sizes**
- Enhances scalability in large design systems
- Type-safe, maintained, and verified on [Socket.dev](https://socket.dev/npm/package/tailwind-variants)

#### Security Evaluation:

- 0 vulnerabilities on Snyk, GitHub, Socket.dev
- Maintained, typed, and minimal dependencies

#### Migration Steps:

```bash
npm remove clsx
npm install tailwind-variants
```

#### Example Refactor:

**Before (clsx):**
```tsx
clsx('p-2', isActive && 'bg-blue-500')
```

**After (tailwind-variants):**
```tsx
import { tv } from 'tailwind-variants';

const button = tv({
  base: 'p-2',
  variants: {
    active: {
      true: 'bg-blue-500',
    },
  },
});

<button className={button({ active: true })} />
```

## Summary

- All dependencies are secure, up-to-date, and verified using multiple vulnerability databases
- No signs of zero-day or critical vulnerabilities
- Recommended practices are applied in both codebase and toolchain
- `tailwind-variants` is proposed as a scalable and secure replacement for `clsx`
