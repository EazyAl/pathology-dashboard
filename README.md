# Medical Pathology Case Dashboard

A modern desktop application built with **Tauri** and **Next.js** for managing and searching medical pathology cases. This application provides a professional interface for healthcare professionals to quickly access and review patient case data.

## 🚀 Features

- **Case Search**: Search for specific medical cases by ID (1-100)
- **Comprehensive Case Display**: View detailed case information including:
  - Diagnosis and tissue information
  - Data modalities and molecular markers
  - Clinical comments and notes
- **Professional UI**: Clean, medical-themed interface optimized for healthcare workflows
- **Desktop Application**: Cross-platform desktop app with native performance
- **Type Safety**: Full TypeScript support for reliable development

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
git clone <your-repo-url>
cd rainpath
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

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start Next.js development server
- `pnpm build` - Build Next.js application
- `pnpm tauri dev` - Start Tauri development mode
- `pnpm tauri build` - Build desktop application
- `pnpm lint` - Run ESLint

### Code Quality

This project follows strict code quality standards:

- **TypeScript**: Full type safety with strict configuration
- **Performance**: API caching and optimized React components
- **Accessibility**: ARIA attributes and semantic HTML
- **Error Handling**: Comprehensive error handling and validation
- **Clean Architecture**: Well-organized file structure with shared types

## 📊 Data Structure

The application uses a JSON file containing 100 medical pathology cases with the following structure:

```typescript
interface MedicalCase {
  caseId: number
  date: string
  diagnosis: string
  comments: string
  dataModalities: string[]
  tissueType: string
  specimenType: string
  grade: number
  stage: string
  molecularMarkers: string[]
}
```

## 🏗️ Architecture

- **Frontend**: Next.js with App Router for modern React development
- **API**: Server-side API routes for data access
- **Desktop**: Tauri for cross-platform desktop application
- **Caching**: In-memory caching for improved performance
- **Validation**: Client and server-side input validation

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for the medical community**
