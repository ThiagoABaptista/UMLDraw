import { useCallback, useEffect } from 'react';
import { UMLDiagram } from '../types/umlTypes';

declare global {
  interface Window {
    vscode?: {
      postMessage: (message: any) => void;
    };
  }
}

const vscodePostMessage = (message: any) => {
  if (window.vscode) {
    window.vscode.postMessage(message);
  }
};

const showMessage = (type: 'info' | 'error', text: string) => {
  vscodePostMessage({
    command: type === 'info' ? 'showInfo' : 'showError',
    text
  });
};

/**
 * Hook para comunicação com o VSCode Webview
 * Agora aceita opcionalmente uma função `getFileName` para salvar com nome personalizado.
 */
export const useVSCodeCommunication = (
  diagram: UMLDiagram,
  diagramType: 'usecase' | 'activity',
  onDiagramLoaded: (diagram: UMLDiagram) => void,
  getFileName?: () => string // ← novo argumento opcional
) => {
  const handleSaveToFile = useCallback(() => {
    const fileName = getFileName ? getFileName() : `${diagram.metadata.name || 'Diagrama'}.uml`;

    vscodePostMessage({
      command: 'saveToFile',
      diagram,
      fileName // envia nome do arquivo ao backend
    });
  }, [diagram, getFileName]);

  const handleSaveToWorkspace = useCallback(() => {
    vscodePostMessage({
      command: 'saveToWorkspace',
      diagram
    });
  }, [diagram]);

  const handleSave = useCallback(() => {
    const fileName = getFileName ? getFileName() : `${diagram.metadata.name || 'Diagrama'}.uml`;

    vscodePostMessage({
      command: 'saveToFile',
      diagram: {
        ...diagram,
        metadata: {
          version: diagram.metadata?.version || '1.0',
          name: diagram.metadata?.name || 'Novo Diagrama',
          created: diagram.metadata?.created || new Date().toISOString(),
          lastModified: new Date().toISOString(),
          type: diagramType
        }
      },
      fileName
    });
  }, [diagram, diagramType, getFileName]);

  const handleSaveAs = useCallback(() => {
    const fileName = getFileName ? getFileName() : `${diagram.metadata.name || 'Diagrama'}.uml`;

        vscodePostMessage({
            command: 'saveAsFile', // novo comando específico
            diagram: {
            ...diagram,
            metadata: {
                version: diagram.metadata?.version || '1.0',
                name: diagram.metadata?.name || 'Novo Diagrama',
                created: diagram.metadata?.created || new Date().toISOString(),
                lastModified: new Date().toISOString(),
                type: diagramType
            }
            },
            fileName
        });
    }, [diagram, diagramType, getFileName]);


  const handleLoad = useCallback(() => {
    vscodePostMessage({ command: 'requestLoad' });
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      switch (message.command) {
        case 'saveDiagram':
          handleSaveToFile();
          break;

        case 'loadDiagram':
        case 'loadInitialDiagram':
          if (message.diagram) {
            onDiagramLoaded(message.diagram);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    vscodePostMessage({ command: 'requestInitialDiagram' });

    return () => window.removeEventListener('message', handleMessage);
  }, [handleSaveToFile, onDiagramLoaded]);

  return {
    handleSaveToFile,
    handleSaveToWorkspace,
    handleSave,
    handleSaveAs,
    handleLoad,
    showMessage
  };
};
