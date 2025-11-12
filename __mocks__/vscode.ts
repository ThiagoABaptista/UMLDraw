export const window = {
  showSaveDialog: jest.fn(),
  showOpenDialog: jest.fn(),
  showInformationMessage: jest.fn(),
  showErrorMessage: jest.fn(),
};

export const workspace = {
  fs: {
    writeFile: jest.fn(),
    readFile: jest.fn(),
  },
};

export const Uri = {
  file: (path: string) => ({ fsPath: path }),
};

// Tipos comuns simulados
export type ExtensionContext = {
  workspaceState: {
    update: jest.Mock;
    get: jest.Mock;
  };
  globalState: {
    update: jest.Mock;
    get: jest.Mock;
  };
};
