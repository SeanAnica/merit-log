# Merit Log

A desktop application for daily task tracking, worklogs, and goal management, built with Rust + Tauri.

## Goals

- Daily tracking: tasks, subtasks, time spent, days consumed vs allocated, comments
- Dashboards: performance charts and key indicators
- Goals module: goals by period, statuses, contextual AI advice
- Cross-platform: Windows / macOS / Linux

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Tauri v2 + Rust
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix)
- **Database**: SQLite via `rusqlite` (bundled — no system SQLite required)
- **Charts**: ECharts or Chart.js *(planned)*
- **State management**: Zustand *(planned)*
- **Validation**: Zod (UI) + Rust domain *(planned)*

## Architecture

### Rust (backend)

```text
src-tauri/src/
├── domain/          # Entities + business rules (Task, Subtask, ...)
├── application/     # Use cases — planned (CreateTask, LogWork, GetDashboard...)
├── infrastructure/  # SQLite connection + migrations
└── commands/        # Tauri invoke handlers (thin API surface)
```

Flow: `UI → invoke("command", payload) → Command → Repository SQLite → DTO → UI`

> `application/` is intentionally absent at MVP stage. Business logic currently lives in `commands/` and will be extracted into use cases as complexity grows.

### Frontend

```text
src/
├── types/           # TypeScript interfaces mirroring Rust structs
├── services/        # Tauri invoke wrappers (one file per domain)
├── components/      # UI components (shadcn/ui + layout)
├── pages/           # One folder per route
└── app/             # Routing config
```

## Data Model (SQLite)

| Table         | Key fields                                                                     |
| ------------- | ------------------------------------------------------------------------------ |
| `task`        | id, title, description, start_date, end_date, allocated_minutes, status        |
| `subtask`     | id, task_id, title, status                                                     |
| `worklog`     | id, date, start_time, end_time, duration_minutes, task_id, subtask_id, comment |
| `goal_period` | id, start_date, end_date, title                                                |
| `goal`        | id, goal_period_id, title, criteria, status, notes                             |
| `ai_advice`   | id, created_at, scope, scope_id, prompt, response                              |

## Features by Version

### MVP

- CRUD Tasks (label, dates, allocation, tags)
- CRUD Subtasks linked to a task
- Daily journal / worklog (entry per task, auto-calculated duration)
- Calculations: consumed vs allocated, actual vs estimated time
- Dashboard v1: key indicators + 2-3 charts

### V1

- Goals by period + statuses + notes
- AI: contextual advice (goals + history)
- CSV export + import
- Search, filters, period views
- Installable packaging (Win / macOS / Linux)

### V2 (backlog)

- Project/client model
- PDF "HR review" report
- Timer mode with pause/resume
- DB encryption (SQLCipher)
- Multi-profile

## Performance Indicators (KPIs)

- **Workload**: utilization rate, consumption vs allocation, drift, breakdown by task/tag
- **Predictability**: estimation accuracy, ahead/late distribution
- **Focus**: context switches per day, average session duration, deep work time
- **Goals**: achievement rate per period, progress

## Development Roadmap

| Step | Content                                                       | Status |
| ---- | ------------------------------------------------------------- | ------ |
| A    | Setup, UI routing, SQLite, first Rust command `create_task`   | Done   |
| B    | Full CRUD Tasks + Subtasks, validations                       | In progress |
| C    | Journal / Worklog, week/month view, auto duration calculation | To do  |
| D    | Rust KpiService, aggregations, unit tests                     | To do  |
| E    | Dashboard v1: KPI tiles + charts + filters                    | To do  |
| F    | CRUD Goals by period, period review                           | To do  |
| G    | AI module: advice, prompting, local storage                   | To do  |
| H    | CSV export + HTML/PDF report                                  | To do  |
| I    | Tests, CI GitHub Actions, installable packaging               | To do  |

Step A deliverable: the app opens, creates a task, persists and reads back data.

## Prerequisites

- **Node.js** v18+
- **Rust** (stable) — [rustup.rs](https://rustup.rs/)
- **Tauri system dependencies** (vary by OS):
  - **Windows**: Microsoft C++ Build Tools + WebView2 (pre-installed on Windows 10/11)
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: `webkit2gtk`, `build-essential`, and others

Full details: [Tauri v2 Prerequisites](https://v2.tauri.app/start/prerequisites/)

> SQLite is compiled into the binary (`rusqlite` bundled feature) — no manual database setup required.
> The database file is created automatically on first launch in the OS app data directory.

## Getting Started

```bash
git clone <repository-url>
cd merit-log
npm install
npm run tauri dev
```

## Available Scripts

| Command               | Description                         |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Frontend-only development server    |
| `npm run tauri dev`   | Full development with Tauri backend |
| `npm run build`       | Build frontend for production       |
| `npm run tauri build` | Build complete desktop application  |
| `npm run preview`     | Preview production build            |

## Project Structure

```text
merit-log/
├── src/                        # React frontend
│   ├── app/                    # Routing config (routes.tsx)
│   ├── types/                  # TypeScript interfaces (Task, Subtask, ...)
│   ├── services/               # Tauri invoke wrappers (taskService, subtaskService)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components (auto-generated, do not edit)
│   │   └── layout/             # Navbar, Layout
│   ├── lib/                    # Shared utilities (cn, etc.)
│   ├── pages/                  # Pages (Dashboard, Journal, Tasks, Goals, Settings)
│   ├── App.tsx                 # Entry point — renders <Layout />
│   ├── App.css                 # Tailwind import + shadcn CSS variables
│   └── main.tsx                # React entry point
├── src-tauri/                  # Rust backend
│   ├── migrations/             # Versioned SQL files (001_create_task.sql, ...)
│   ├── src/
│   │   ├── domain/             # Entities: Task, Subtask
│   │   ├── infrastructure/     # SQLite connection + migration runner (db.rs)
│   │   ├── commands/           # Tauri invoke handlers: task.rs, subtask.rs
│   │   └── lib.rs              # App bootstrap + managed state
│   ├── Cargo.toml              # Rust dependencies
│   └── tauri.conf.json         # Tauri configuration
├── components.json             # shadcn/ui configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [Rust Analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## License

MIT
