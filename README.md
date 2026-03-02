# Merit Log

A desktop application for tracking and managing merit-based logs, built with modern web technologies and native performance.

## Overview

Merit Log is a cross-platform desktop application that combines the power of Rust backend performance with a React-based user interface, providing a seamless experience for managing merit logs.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Tauri + Rust
- **Styling**: CSS3
- **Build Tool**: Vite

## Features

- 🚀 Fast and responsive desktop application
- 🔒 Secure local data management
- 💻 Cross-platform support (Windows, macOS, Linux)
- ⚡ Native performance with Rust backend
- 🎨 Modern React UI

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) and npm/yarn
- **Rust** (latest stable version)
  - Install from: https://rustup.rs/
- **Tauri CLI** (optional, but recommended)
  ```bash
  npm install -g @tauri-apps/cli
  ```

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd merit-log
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Rust dependencies:
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

### Development

Start the development server:

```bash
npm run tauri dev
```

This will open the Tauri development window with hot-reload enabled.

### Building

Build the production application:

```bash
npm run tauri build
```

The compiled application will be in `src-tauri/target/release/`.

## Project Structure

```
merit-log/
├── src/                      # React frontend source
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # React entry point
│   └── assets/              # Static assets
├── src-tauri/               # Rust backend
│   ├── src/                 # Rust source files
│   ├── Cargo.toml          # Rust dependencies
│   ├── tauri.conf.json     # Tauri configuration
│   └── capabilities/        # Permission configurations
├── package.json             # Frontend dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [Rust Analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Available Scripts

- `npm run dev` - Start development server (frontend only)
- `npm run tauri dev` - Start development with Tauri backend
- `npm run build` - Build frontend for production
- `npm run tauri build` - Build complete desktop application
- `npm run preview` - Preview production build

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
