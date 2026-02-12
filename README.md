# iFi - Ittefaq Fasteners Industries

This project is a React application built with Vite, designed to run smoothly in VS Code.

## Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [VS Code](https://code.visualstudio.com/)

## Setup

1. **Open the folder** in VS Code.
2. Open a **New Terminal** (`Ctrl + ~`).
3. Run the following command to install dependencies:
   ```sh
   npm install
   ```

## Running the App

To start the development server:

```sh
npm run dev
```

The app will be available at imports `http://localhost:3000`.

## Building for Production

To create a production build:

```sh
npm run build
```

The output will be in the `dist` folder.

## Troubleshooting

- **Script Execution Disabled**: If you see an error about scripts being disabled in PowerShell:
  - Run this command in PowerShell as Admin: `Set-ExecutionPolicy RemoteSigned`
  - Or run commands using Command Prompt (`cmd`) instead of PowerShell.

## VS Code Recommended Extensions

- **Tailwind CSS IntelliSense**: For CSS class autocompletion.
- **ESLint** & **Prettier**: For code formatting and linting.
