# Just Save - Expense Analyzer

A Next.js application that analyzes expenses and subscriptions from CSV and PDF files. Upload your transaction files to get categorized insights into your spending.

## Features

- 📄 **CSV & PDF Support**: Upload and process both CSV and PDF transaction files
- 🏷️ **Automatic Categorization**: Transactions are automatically categorized (Streaming, Gaming, Software, etc.)
- 🔍 **Service Detection**: Automatically detects common subscription services (Netflix, Spotify, PlayStation, etc.)
- 📊 **Yearly Summary**: Calculates and displays your yearly subscription costs
- 🔒 **Privacy First**: Files are processed locally and never stored

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Drag and drop a CSV or PDF file onto the upload area, or click to browse
2. Wait for the file to be processed
3. View your categorized expenses and subscription summary

## CSV File Format

Your CSV file should include columns for:
- Date
- Description/Merchant name
- Amount

The app will automatically detect these columns by common naming patterns.

## Project Structure

```
just-save/
├── app/
│   ├── api/
│   │   └── process-pdf/     # API route for PDF processing
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── FileDropZone.tsx     # Drag and drop file upload
│   └── ResultsDisplay.tsx   # Results display component
├── utils/
│   └── fileProcessor.ts     # File processing utilities
└── types/
    └── index.ts             # TypeScript type definitions
```

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- PapaParse (CSV parsing)
- pdf-parse (PDF parsing)

## License

MIT

