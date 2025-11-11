import React from 'react';

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

jest.mock('../../src/webview/App', () => ({
  __esModule: true,
  default: () => <div>Mocked App</div>,
}));

describe('main.tsx (comportamento geral)', () => {
  let originalAcquireVsCodeApi: any;
  let originalConsoleError: any;
  let originalConsoleLog: any;

  beforeEach(() => {
    jest.resetModules(); // garante que o require executa novamente

    originalAcquireVsCodeApi = (window as any).acquireVsCodeApi;
    originalConsoleError = console.error;
    originalConsoleLog = console.log;

    const mockContainer = document.createElement('div');
    mockContainer.id = 'root';
    jest.spyOn(document, 'getElementById').mockReturnValue(mockContainer);

    jest.clearAllMocks();
    delete (window as any).vscode;
    delete (window as any).acquireVsCodeApi;
  });

  afterEach(() => {
    if (originalAcquireVsCodeApi) {
      (window as any).acquireVsCodeApi = originalAcquireVsCodeApi;
    }
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
    jest.restoreAllMocks();
  });

  it('inicializa VS Code API quando disponível', () => {
    const mockVsCodeApi = { postMessage: jest.fn() };
    (window as any).acquireVsCodeApi = jest.fn(() => mockVsCodeApi);

    jest.isolateModules(() => {
      require('../../src/webview/main');
    });

    expect(window.acquireVsCodeApi).toHaveBeenCalled();
    expect(window.vscode).toBe(mockVsCodeApi);
  });

  it('define vscode como undefined quando API não está disponível', () => {
    jest.isolateModules(() => {
      require('../../src/webview/main');
    });

    expect(window.vscode).toBeUndefined();
  });

  it('lida com erro na inicialização da VS Code API', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    (window as any).acquireVsCodeApi = jest.fn(() => {
      throw new Error('API error');
    });

    jest.isolateModules(() => {
      expect(() => require('../../src/webview/main')).not.toThrow();
    });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Erro ao inicializar VS Code API:'),
      expect.any(Error)
    );
  });

  it('renderiza React no container root', () => {
    const { createRoot } = require('react-dom/client');
    const mockRoot = { render: jest.fn() };
    createRoot.mockReturnValue(mockRoot);

    jest.isolateModules(() => {
      require('../../src/webview/main');
    });

    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(createRoot).toHaveBeenCalledWith(expect.any(HTMLElement));
    expect(mockRoot.render).toHaveBeenCalledWith(expect.any(Object));
  });

  it('lança erro quando container root não é encontrado', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    expect(() => {
      jest.isolateModules(() => {
        require('../../src/webview/main');
      });
    }).toThrow('Root container not found');
  });

  it('registra logs informativos sem erros', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    jest.isolateModules(() => {
      expect(() => require('../../src/webview/main')).not.toThrow();
    });

    expect(consoleLogSpy).toHaveBeenCalled();
  });
});
