import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

declare global {
  interface Window {
    vscode?: {
      postMessage: (message: any) => void;
    };
    acquireVsCodeApi?: () => any;
  }
}

const initializeVSCodeAPI = () => {
  if (typeof window !== 'undefined' && typeof (window as any).acquireVsCodeApi !== 'undefined') {
    try {
      const vscodeApi = (window as any).acquireVsCodeApi();
      (window as any).vscode = vscodeApi;
      console.log('VS Code API inicializada com sucesso');
    } catch (error) {
      console.log('Erro ao inicializar VS Code API:', error);
      (window as any).vscode = undefined;
    }
  } else {
    console.log('Modo de desenvolvimento: VS Code API não disponível');
    (window as any).vscode = undefined;
  }
};

// Inicializa a API
initializeVSCodeAPI();

console.log('Aplicação iniciando...');

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

try {
  const root = createRoot(container);
  root.render(<App />);
  console.log('React aplicado com sucesso');
} catch (error) {
  console.error('Erro ao renderizar React:', error);
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Erro ao carregar a aplicação. Verifique o console.</div>';
}