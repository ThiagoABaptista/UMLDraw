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

export const useVSCodeCommunication = (
    diagram: UMLDiagram,
    diagramType: 'usecase' | 'activity',
    onDiagramLoaded: (diagram: UMLDiagram) => void
) => {
    const handleSaveToFile = useCallback(() => {
        vscodePostMessage({
            command: 'saveToFile',
            diagram: diagram
        });
    }, [diagram]);

    const handleSaveToWorkspace = useCallback(() => {
        vscodePostMessage({
            command: 'saveToWorkspace',
            diagram: diagram
        });
    }, [diagram]);

    const handleSave = useCallback(() => {
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
        }
        });
    }, [diagram, diagramType]);

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
            if (message.diagram) {
                onDiagramLoaded(message.diagram);
            }
            break;
            
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
        handleLoad,
        showMessage
    };
};