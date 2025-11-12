import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  roots: ["<rootDir>/__tests__", "<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
    // Mocks para bibliotecas que causam problemas nos testes
    "^html2canvas$": "<rootDir>/__mocks__/html2canvas.js",
    "^jspdf$": "<rootDir>/__mocks__/jspdf.js",
    "^vscode$": "<rootDir>/__mocks__/vscode.ts",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  transformIgnorePatterns: [
    // Inclua aqui bibliotecas que precisam ser transformadas pelo Jest
    "node_modules/(?!(lucide-react|konva|react-konva)/)"
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.ts",
    "!src/types/**/*",
    "!src/extension.ts", // Ignora arquivo de extensão
    "!src/**/*.css", // Ignora arquivos CSS
    "!src/webview/main.tsx", // Pode ignorar o ponto de entrada se necessário
  ],
  testMatch: [
    "**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)",
    "**/*.(test|spec).(ts|tsx|js|jsx)"
  ],
  // Configurações para melhor performance e debugging
  testTimeout: 10000,
  verbose: true,
};

export default config;