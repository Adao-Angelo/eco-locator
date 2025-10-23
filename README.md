# ♻️ Eco Locator

A **Next.js** application to manage and locate recycling points.  
Includes an **admin dashboard**, **interactive map**, and **dynamic forms** to register and monitor eco-points.

---

## 🌍 Main Goals

- Register recycling points with accepted materials, contact info, opening hours, and location.  
- Visualize points on an interactive map and filter by materials or status.  
- Provide a simple admin dashboard to monitor key metrics.

---

## 🚀 Project Status

| Stage | Status |
|--------|--------|
| Implementation | ✅ Functional (frontend) |
| Tests | 🧪 Basic coverage with Vitest |
| Deployment | 🌐 Ready for Vercel |

---

## ✨ Features

- Interactive list and map of recycling points  
- Modal form with validation for new entries  
- Dashboard with statistics and materials distribution  
- Simple login authentication  
- Unit tests with **Vitest + Testing Library**

---

## 🧰 Technologies

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase
- lucide-react (icons)
- Vitest + @testing-library/react

---

## ⚙️ Requirements

- Node.js 18+  
- pnpm (recommended) / npm / yarn

---

## 🧩 Installation

```bash
pnpm install
```

---

## 🧠 Development

```bash
pnpm dev
# or
npm run dev
```

---

## 🏗️ Build and Production

```bash
pnpm build
pnpm start
```

---

## 🧪 Tests

```bash
pnpm exec vitest run
# watch mode
pnpm exec vitest --watch
```

---

## 📜 Package Scripts

| Script | Description |
|---------|-------------|
| dev | Start development server |
| build | Create production build |
| start | Run production build |
| test | Run Vitest |
| test:watch | Run Vitest in watch mode |

---

## 🧱 Best Practices

- Reusable, small UI components inside `components/ui/*`  
- Business logic separated in `hooks/`  
- Explicit TypeScript types and usage of `React.forwardRef`  
- Tests located near related components  
- Optimizations using `React.memo` and dynamic imports (`ssr: false`)

---

## 🗂️ Project Structure

```
app/
 ├─ dashboard/_components/   # dashboard components
 ├─ hooks/                   # custom hooks and logic
components/
 └─ ui/                      # shared UI components
lib/
 └─ supabase.ts              # Supabase client and utilities
tests/                       # test files
```

---

## 🤝 Contribution Guide

1. Create a feature branch from `main`.  
2. Run linters and tests locally before committing.  
3. Keep commits small and descriptive.  
4. Open a Pull Request describing your changes and added tests.

---

## ☁️ Deployment

- Recommended platform: **Vercel**  
- Ensure production environment variables are set:  
  - `SUPABASE_URL`  
  - `SUPABASE_KEY`

---

## 💡 Quick Tips

- Run `pnpm exec vitest --coverage` to see coverage report.  
- Use linters and Prettier before commits.  
- Keep components small and maintainable.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

```
MIT License © 2025 Adao Ângelo João
```

---

## 📬 Contact

📧 **Email:** [adãobegginer@gmail.com](mailto:adãobegginer@gmail.com)  
Developed with dedication by **Adao Ângelo João**
