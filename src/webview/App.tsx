import React, { useState, useCallback, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { UseCaseComponent } from '../components/UseCaseComponent';
import { ActivityComponent } from '../components/ActivityComponent';
import { UMLRelationshipComponent } from '../components/UMLRelationship';
import { Toolbar } from '../components/Toolbar';
import { ElementPreview } from '../components/ElementPreview';
import { 
  UseCaseElement, ActivityElement, UMLRelationship, UMLDiagram, Tool, 
  CreationState, ConnectionState, RelationshipType, 
  DiagramMetadata
} from '../types/umlTypes';
import { ExportService } from '../services/exportService';

declare global {
  interface Window {
    vscode?: {
      postMessage: (message: any) => void;
    };
  }
}

const initialDiagram: UMLDiagram = {
  metadata: {
    version: '1.0',
    name: 'Novo Diagrama de Caso de Uso',
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    type: 'usecase'
  },
  elements: [
    {
      id: '1',
      type: 'actor',
      name: 'Usuário',
      x: 100,
      y: 100,
      width: 80,
      height: 120
    },
    {
      id: '2',
      type: 'usecase',
      name: 'Realizar Login',
      x: 300,
      y: 120,
      width: 150,
      height: 60
    }
  ],
  relationships: [
    {
      id: 'rel1',
      from: '1',
      to: '2',
      type: 'association'
    }
  ]
};

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

const createDefaultMetadata = (type: 'usecase' | 'activity' = 'usecase'): DiagramMetadata => ({
  version: '1.0',
  name: 'Novo Diagrama',
  created: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  type: type
});

export default function App() {
  const [diagram, setDiagram] = useState<UMLDiagram>(() => ({
    ...initialDiagram,
    metadata: createDefaultMetadata('usecase')
  }));
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>('select');
  const [isEditing, setIsEditing] = useState(false);
  const [creationState, setCreationState] = useState<CreationState>('idle');
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [diagramType, setDiagramType] = useState<'usecase' | 'activity'>('usecase');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      
      switch (message.command) {
        case 'saveDiagram':
          handleSaveToFile();
          break;
          
        case 'loadDiagram':
          if (message.diagram) {
            setDiagram(message.diagram);
            setDiagramType(message.diagram.metadata?.type || 'usecase');
          }
          break;
          
        case 'loadInitialDiagram':
          if (message.diagram) {
            setDiagram(message.diagram);
            setDiagramType(message.diagram.metadata?.type || 'usecase');
          }
          break;

        case 'changeDiagramType':
          setDiagramType(message.diagramType);
          setDiagram(prev => ({
            ...prev,
            metadata: {
              ...prev.metadata,
              type: message.diagramType
            },
            elements: [],
            relationships: []
          }));
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    vscodePostMessage({ command: 'requestInitialDiagram' });

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleElementDragEnd = useCallback((id: string, x: number, y: number) => {
    setDiagram(prev => ({
      ...prev,
      elements: prev.elements.map(element =>
        element.id === id ? { ...element, x, y } : element
      )
    }));
  }, []);

  const handleElementClick = useCallback((id: string) => {
    if (creationState === 'placing') return;

    if (connectionState === 'selecting-first') {
      setConnectionStart(id);
      setConnectionState('selecting-second');
      setSelectedElement(id);
    } else if (connectionState === 'selecting-second') {
      if (connectionStart && connectionStart !== id) {
        const newRelationship: UMLRelationship = {
          id: Date.now().toString(),
          from: connectionStart,
          to: id,
          type: getDefaultRelationshipType()
        };

        setDiagram(prev => ({
          ...prev,
          relationships: [...prev.relationships, newRelationship]
        }));
      }
      setConnectionState('idle');
      setConnectionStart(null);
      setSelectedElement(id);
    } else {
      setSelectedElement(id);
      setIsEditing(false);
    }
  }, [creationState, connectionState, connectionStart]);

  const getDefaultRelationshipType = (): RelationshipType => {
    if (diagramType === 'activity') return 'flow';
    return 'association';
  };

  const handleStageClick = useCallback((e: any) => {
    const stage = e.target.getStage();
    
    if (e.target === stage) {
      if (creationState === 'placing' && tool !== 'select' && tool !== 'relationship') {
        const pos = stage.getPointerPosition();
        const newElement = createNewElement(tool, pos.x, pos.y);
        
        setDiagram(prev => ({
          ...prev,
          elements: [...prev.elements, newElement]
        }));
        
        setSelectedElement(newElement.id);
        setCreationState('idle');
        setTool('select');
      }
      else if (connectionState !== 'idle') {
        setConnectionState('idle');
        setConnectionStart(null);
      }
      clearEditingState();
    }
  }, [creationState, tool, connectionState, diagramType]);

  const createNewElement = (tool: Tool, x: number, y: number): UseCaseElement | ActivityElement => {
    const baseElement = {
      id: Date.now().toString(),
      name: getDefaultName(tool),
      x: x - 40,
      y: y - 30,
      width: 80,
      height: 60,
      isEditing: false
    };

    if (diagramType === 'usecase') {
      return {
        ...baseElement,
        type: tool === 'actor' ? 'actor' : 'usecase',
        width: tool === 'actor' ? 60 : 120,
        height: tool === 'actor' ? 100 : 60
      } as UseCaseElement;
    } else {
      return {
        ...baseElement,
        type: tool as ActivityElement['type'],
        width: getActivityElementWidth(tool),
        height: getActivityElementHeight(tool)
      } as ActivityElement;
    }
  };

  const getDefaultName = (tool: Tool): string => {
    const names = {
      actor: 'Ator',
      usecase: 'Caso de Uso',
      activity: 'Atividade',
      decision: 'Decisão',
      start: 'Início',
      end: 'Fim'
    };
    return names[tool as keyof typeof names] || 'Elemento';
  };

  const getActivityElementWidth = (tool: Tool): number => {
    const widths = {
      activity: 120,
      decision: 80,
      start: 40,
      end: 40,
      fork: 20,
      join: 20,
      merge: 20
    };
    return widths[tool as keyof typeof widths] || 80;
  };

  const getActivityElementHeight = (tool: Tool): number => {
    const heights = {
      activity: 60,
      decision: 60,
      start: 40,
      end: 40,
      fork: 80,
      join: 80,
      merge: 20
    };
    return heights[tool as keyof typeof heights] || 60;
  };

  const handleMouseMove = useCallback((e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setMousePosition(pos);
  }, []);

  const handleTextEdit = useCallback((id: string, value: string) => {
    setDiagram(prev => ({
      ...prev,
      elements: prev.elements.map(element =>
        element.id === id ? { ...element, name: value } : element
      )
    }));
    setIsEditing(false);
  }, []);

  const handleToolChange = useCallback((newTool: Tool) => {
    if (newTool === 'relationship') {
      setCreationState('idle');
      setConnectionState('selecting-first');
      setConnectionStart(null);
      setTool(newTool);
      setSelectedElement(null);
      setIsEditing(false);
    } else {
      setCreationState('placing');
      setConnectionState('idle');
      setConnectionStart(null);
      setTool(newTool);
      setSelectedElement(null);
      setIsEditing(false);
    }
  }, []);

  const handleToggleEdit = useCallback(() => {
    if (connectionState !== 'idle') return;
    
    setIsEditing(prev => !prev);
    if (!isEditing && selectedElement) {
      setDiagram(prev => ({
        ...prev,
        elements: prev.elements.map(element => ({
          ...element,
          isEditing: element.id === selectedElement
        }))
      }));
    } else {
      clearEditingState();
    }
  }, [isEditing, selectedElement, connectionState]);

  const clearEditingState = useCallback(() => {
    setDiagram(prev => ({
      ...prev,
      elements: prev.elements.map(element => ({
        ...element,
        isEditing: false
      }))
    }));
    setIsEditing(false);
  }, []);

  const getElementCenter = (element: UseCaseElement | ActivityElement) => ({
    x: element.x + element.width / 2,
    y: element.y + element.height / 2
  });

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

  const handleExportPNG = useCallback(async () => {
    try {
      const stageContainer = document.querySelector('.konvajs-content');
      if (stageContainer) {
        await ExportService.exportToPNG(stageContainer as HTMLElement, `diagrama-${diagramType}.png`);
        showMessage('info', 'Diagrama exportado como PNG com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao exportar PNG:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Fallback para desenvolvimento
      if (!window.vscode) {
        alert('Erro ao exportar PNG (modo desenvolvimento): ' + errorMessage);
      } else {
        showMessage('error', `Erro ao exportar PNG: ${errorMessage}`);
      }
    }
  }, [diagramType]);

  const handleExportPDF = useCallback(async () => {
    try {
      const stageContainer = document.querySelector('.konvajs-content');
      if (stageContainer) {
        await ExportService.exportToPDF(stageContainer as HTMLElement, `diagrama-${diagramType}.pdf`);
        showMessage('info', 'Diagrama exportado como PDF com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Fallback para desenvolvimento
      if (!window.vscode) {
        alert('Erro ao exportar PDF (modo desenvolvimento): ' + errorMessage);
      } else {
        showMessage('error', `Erro ao exportar PDF: ${errorMessage}`);
      }
    }
  }, [diagramType]);

  const handleSaveToWorkspace = useCallback(() => {
    vscodePostMessage({
      command: 'saveToWorkspace',
      diagram: diagram
    });
  }, [diagram]);

  const handleSaveToFile = useCallback(() => {
    vscodePostMessage({
      command: 'saveToFile',
      diagram: diagram
    });
  }, [diagram]);

  const handleDiagramTypeChange = useCallback((type: 'usecase' | 'activity') => {
    setDiagramType(type);
    setDiagram(prev => ({
      metadata: {
        version: prev.metadata?.version || '1.0',
        name: prev.metadata?.name || 'Novo Diagrama',
        created: prev.metadata?.created || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        type: type
      },
      elements: [],
      relationships: []
    }));
    vscodePostMessage({ command: 'changeDiagramType', diagramType: type });
  }, []);

  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      handleSaveToWorkspace();
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [diagram, handleSaveToWorkspace]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toolbar
        tool={tool}
        onToolChange={handleToolChange}
        onToggleEdit={handleToggleEdit}
        onSave={handleSave}
        onLoad={handleLoad}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        isEditing={isEditing}
        selectedElement={selectedElement}
        creationState={creationState}
        connectionState={connectionState}
        diagramType={diagramType}
        onDiagramTypeChange={handleDiagramTypeChange}

      />
      
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight - 50}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          <ElementPreview 
            x={mousePosition.x} 
            y={mousePosition.y} 
            visible={creationState === 'placing' && tool !== 'select' && tool !== 'relationship'}
            tool={tool}
            diagramType={diagramType}
          />

          {diagram.relationships.map((rel: UMLRelationship) => {
            const fromElement = diagram.elements.find(e => e.id === rel.from);
            const toElement = diagram.elements.find(e => e.id === rel.to);
            
            if (!fromElement || !toElement) return null;

            return (
              <UMLRelationshipComponent
                key={rel.id}
                relationship={rel}
                from={getElementCenter(fromElement)}
                to={getElementCenter(toElement)}
                isSelected={selectedElement === rel.id}
                onClick={handleElementClick}
                diagramType={diagramType}
              />
            );
          })}

          {diagram.elements.map((element) => {
            if (diagramType === 'usecase' && isUseCaseElement(element)) {
              return (
                <UseCaseComponent
                  key={element.id}
                  element={element as UseCaseElement}
                  onDragEnd={handleElementDragEnd}
                  onClick={handleElementClick}
                  onTextEdit={handleTextEdit}
                  isSelected={selectedElement === element.id}
                />
              );
            } else if (diagramType === 'activity' && isActivityElement(element)) {
              return (
                <ActivityComponent
                  key={element.id}
                  element={element as ActivityElement}
                  onDragEnd={handleElementDragEnd}
                  onClick={handleElementClick}
                  onTextEdit={handleTextEdit}
                  isSelected={selectedElement === element.id}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}

// Type guards
function isUseCaseElement(element: any): element is UseCaseElement {
  return element.type === 'actor' || element.type === 'usecase' || element.type === 'system';
}

function isActivityElement(element: any): element is ActivityElement {
  return ['start', 'end', 'activity', 'decision', 'fork', 'join', 'merge'].includes(element.type);
}