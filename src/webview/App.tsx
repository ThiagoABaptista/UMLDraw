import { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { Toolbar } from '../components/Toolbar';
import { UMLRelationshipComponent } from '../components/UMLRelationship';
import { UseCaseComponent } from '../components/UseCaseComponent';
import { ActivityComponent } from '../components/ActivityComponent';
import { ElementPreview } from '../components/ElementPreview';
import { useDiagramState } from '../hooks/useDiagramState';
import { useDiagramOperations } from '../hooks/useDiagramOperations';
import { useVSCodeCommunication } from '../hooks/useVSCodeCommunication';
import { useStageInteractions } from '../hooks/useStageInteractions';
import { ExportService } from '../services/exportService';
import { UseCaseElement, ActivityElement } from '../types/umlTypes';

export default function App() {
  const [diagramType, setDiagramType] = useState<'usecase' | 'activity'>('usecase');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Hooks customizados
  const diagramState = useDiagramState();
  const operations = useDiagramOperations(
    {
      diagram: diagramState.diagram,
      selectedElement: diagramState.selectedElement,
      tool: diagramState.tool,
      isEditing: diagramState.isEditing,
      creationState: diagramState.creationState,
      connectionState: diagramState.connectionState,
      connectionStart: diagramState.connectionStart,
      setDiagram: diagramState.setDiagram,
      setSelectedElement: diagramState.setSelectedElement,
      setTool: diagramState.setTool,
      setIsEditing: diagramState.setIsEditing,
      setCreationState: diagramState.setCreationState,
      setConnectionState: diagramState.setConnectionState,
      setConnectionStart: diagramState.setConnectionStart,
      updateDiagram: diagramState.updateDiagram,
      clearEditingState: diagramState.clearEditingState
    },
    diagramType
  );

  const vsCodeComm = useVSCodeCommunication(
    diagramState.diagram,
    diagramType,
    (diagram) => {
      diagramState.setDiagram(diagram);
      setDiagramType(diagram.metadata.type);
    }
  );

  const stageInteractions = useStageInteractions({
    creationState: diagramState.creationState,
    tool: diagramState.tool,
    connectionState: diagramState.connectionState,
    createNewElement: operations.createNewElement,
    updateDiagram: diagramState.updateDiagram,
    setSelectedElement: diagramState.setSelectedElement,
    setCreationState: diagramState.setCreationState,
    setTool: diagramState.setTool,
    setConnectionState: diagramState.setConnectionState,
    setConnectionStart: diagramState.setConnectionStart,
    clearEditingState: diagramState.clearEditingState
  });

  // Funções de exportação
  const handleExportPNG = async () => {
    try {
      const stageContainer = document.querySelector('.konvajs-content');
      if (stageContainer) {
        await ExportService.exportToPNG(stageContainer as HTMLElement, `diagrama-${diagramType}.png`);
        vsCodeComm.showMessage('info', 'Diagrama exportado como PNG com sucesso!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      vsCodeComm.showMessage('error', `Erro ao exportar PNG: ${errorMessage}`);
    }
  };

  const handleExportPDF = async () => {
    try {
      const stageContainer = document.querySelector('.konvajs-content');
      if (stageContainer) {
        await ExportService.exportToPDF(stageContainer as HTMLElement, `diagrama-${diagramType}.pdf`);
        vsCodeComm.showMessage('info', 'Diagrama exportado como PDF com sucesso!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      vsCodeComm.showMessage('error', `Erro ao exportar PDF: ${errorMessage}`);
    }
  };

  // Funções auxiliares
  const getElementCenter = (element: UseCaseElement | ActivityElement) => ({
    x: element.x + element.width / 2,
    y: element.y + element.height / 2
  });

  const isUseCaseElement = (element: UseCaseElement | ActivityElement): element is UseCaseElement => {
    return element.type === 'actor' || element.type === 'usecase' || element.type === 'system';
  };

  const isActivityElement = (element: UseCaseElement | ActivityElement): element is ActivityElement => {
    return ['start', 'end', 'activity', 'decision', 'fork', 'join', 'merge'].includes(element.type);
  };

  const handleDiagramTypeChange = (type: 'usecase' | 'activity') => {
    setDiagramType(type);
    diagramState.setDiagram({
      metadata: {
        version: '1.0',
        name: 'Novo Diagrama',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        type: type
      },
      elements: [],
      relationships: []
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toolbar
        tool={diagramState.tool}
        onToolChange={operations.handleToolChange}
        onToggleEdit={operations.handleToggleEdit}
        onSave={vsCodeComm.handleSave}
        onLoad={vsCodeComm.handleLoad}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        isEditing={diagramState.isEditing}
        selectedElement={diagramState.selectedElement}
        creationState={diagramState.creationState}
        connectionState={diagramState.connectionState}
        diagramType={diagramType}
        onDiagramTypeChange={handleDiagramTypeChange}
      />
      
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight - 50}
        onClick={stageInteractions.handleStageClick}
        onTap={stageInteractions.handleStageClick}
        onMouseMove={(e) => stageInteractions.handleMouseMove(e, setMousePosition)}
      >
        <Layer>
          <ElementPreview 
            x={mousePosition.x} 
            y={mousePosition.y} 
            visible={diagramState.creationState === 'placing' && diagramState.tool !== 'select' && diagramState.tool !== 'relationship'}
            tool={diagramState.tool}
            diagramType={diagramType}
          />

          {diagramState.diagram.relationships.map((rel) => {
            const fromElement = diagramState.diagram.elements.find(e => e.id === rel.from);
            const toElement = diagramState.diagram.elements.find(e => e.id === rel.to);
            
            if (!fromElement || !toElement) return null;

            return (
              <UMLRelationshipComponent
                key={rel.id}
                relationship={rel}
                from={getElementCenter(fromElement)}
                to={getElementCenter(toElement)}
                isSelected={diagramState.selectedElement === rel.id}
                onClick={operations.handleElementClick}
                diagramType={diagramType}
              />
            );
          })}

          {diagramState.diagram.elements.map((element) => {
            if (diagramType === 'usecase' && isUseCaseElement(element)) {
              return (
                <UseCaseComponent
                  key={element.id}
                  element={element}
                  onDragEnd={operations.handleElementDragEnd}
                  onClick={operations.handleElementClick}
                  onTextEdit={operations.handleTextEdit}
                  isSelected={diagramState.selectedElement === element.id}
                />
              );
            } else if (diagramType === 'activity' && isActivityElement(element)) {
              return (
                <ActivityComponent
                  key={element.id}
                  element={element}
                  onDragEnd={operations.handleElementDragEnd}
                  onClick={operations.handleElementClick}
                  onTextEdit={operations.handleTextEdit}
                  isSelected={diagramState.selectedElement === element.id}
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