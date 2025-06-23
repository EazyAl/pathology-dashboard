# Medical Pathology Case Dashboard

This application provides a professional interface for healthcare professionals to quickly access and review patient case data.

## 🚀 Features

- **Case Search**: Search for specific medical cases by ID (1-100)
- **Comprehensive Case Display**: View detailed case information including:
  - Diagnosis and tissue information
  - Data modalities and molecular markers
  - Clinical comments and notes

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Desktop Framework**: Tauri 2.0
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Styling**: CSS with modern design patterns

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)
- **Rust** (latest stable version)
- **Tauri CLI** (`pnpm add -g @tauri-apps/cli`)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/EazyAl/pathology-dashboard
cd pathology-dashboard
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm tauri dev
```

This will start both the Next.js development server and the Tauri desktop application.

## 📁 Project Structure

```
rainpath/
├── app/                    # Next.js App Router
│   ├── api/cases/         # API routes
│   ├── components/        # React components
│   ├── types/            # TypeScript type definitions
│   └── ...               # Next.js pages and layouts
├── public/               # Static assets
│   └── medical_pathology_cases.json
├── src-tauri/           # Tauri backend (Rust)
├── package.json         # Node.js dependencies
└── tsconfig.json        # TypeScript configuration
```

## 🚀 Deployment

### Desktop Application

```bash
pnpm tauri build
```

This creates platform-specific installers in `src-tauri/target/release/`.

### Web Application

```bash
pnpm build
pnpm start
```

## 🔄 CI/CD

This project includes GitHub Actions workflows for automated testing and releases:

### Continuous Integration (`ci.yml`)
- **Triggers**: Push to `main`/`develop` branches, pull requests to `main`
- **Tests**: 
  - Frontend compilation and TypeScript checking (Next.js)
  - API route testing
  - Rust compilation, formatting, and linting
  - Cross-platform Tauri builds (macOS, Linux, Windows)
  - Integration testing

### Release (`release.yml`)
- **Triggers**: Push of version tags (e.g., `v1.0.0`)
- **Actions**: Builds and publishes desktop app binaries for all platforms
- **Output**: Draft GitHub release with downloadable installers

To create a release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

