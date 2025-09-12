import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Declaração global para o vscode
declare global {
  interface Window {
    vscode?: {
      postMessage: (message: any) => void;
    };
    acquireVsCodeApi?: () => any;
  }
}

// Polyfill para desenvolvimento
const initializeVSCodeAPI = () => {
  if (typeof window.acquireVsCodeApi !== 'undefined') {
    try {
      const vscodeApi = window.acquireVsCodeApi();
      window.vscode = vscodeApi;
    } catch (error) {
      console.log('Erro ao inicializar VS Code API:', error);
      window.vscode = undefined;
    }
  } else {
    console.log('Modo de desenvolvimento: VS Code API não disponível');
    window.vscode = undefined;
  }
};

// Inicializa a API
initializeVSCodeAPI();

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

const root = createRoot(container);
root.render(<App />);