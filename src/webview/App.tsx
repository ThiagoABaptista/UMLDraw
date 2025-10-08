import React, { useState } from "react";
import { Stage, Layer } from "react-konva";

import { Toolbar } from "../components/Toolbar";
import { UMLRelationshipComponent } from "../components/UMLRelationship";
import { UseCaseComponent } from "../components/UseCaseComponent";
import { ActivityComponent } from "../components/ActivityComponent";
import { ElementPreview } from "../components/ElementPreview";
import { DebugLayer } from "../hooks/useDebugLayer";

import { useDiagramState } from "../hooks/useDiagramState";
import { useDiagramOperations } from "../hooks/useDiagramOperations";
import { useVSCodeCommunication } from "../hooks/useVSCodeCommunication";
import { useStageInteractions } from "../hooks/useStageInteractions";
import { useCanvasResize } from "../hooks/useCanvasResize";
import { useMousePosition } from "../hooks/useMousePosition";
import { useStageZoom } from "../hooks/useStageZoom";
import { useStageDragFeedback } from "../hooks/useStageDragFeedback";

import { ExportService } from "../services/exportService";
import { UMLDiagram, UseCaseElement, ActivityElement } from "../types/umlTypes";
import { GridBackground } from "../components/GridBackground";

import { ConfirmDialog } from "../components/ConfirmDialog";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export default function App() {
  const [diagramType, setDiagramType] = useState<"usecase" | "activity">("usecase");

  // 🎛️ Estado e hooks principais
  const diagramState = useDiagramState();
  const { mousePosition } = useMousePosition();
  const { handleStageWheel, handleStagePan, handleDoubleClick } = useStageZoom();
  const stageSize = useCanvasResize(50);
  const { handleDragMove } = useStageDragFeedback({
    updateDiagram: diagramState.updateDiagram,
  });
  const [mousePosLocal, setMousePosLocal] = useState({ x: 0, y: 0 });

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
      clearEditingState: diagramState.clearEditingState,
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
    clearEditingState: diagramState.clearEditingState,
    onMousePositionChange: setMousePosLocal
  });

  // confirm dialog state
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    message: string;
    onConfirm?: () => void;
  }>({ open: false, message: '', onConfirm: undefined });

  // keyboard shortcuts: delete key triggers delete flow
  useKeyboardShortcuts({
    onDelete: () => {
      if (!diagramState.selectedElement) return;
      handleDeleteRequest(diagramState.selectedElement);
    }
  });

  // export functions
  const handleExportPNG = async () => {
    try {
      const stageContainer = document.querySelector(".konvajs-content") as HTMLElement;
      if (!stageContainer) throw new Error("Container do diagrama não encontrado");

      await ExportService.exportToPNG(stageContainer, `diagrama-${diagramType}.png`);
      vsCodeComm.showMessage("info", "Diagrama exportado como PNG com sucesso!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      vsCodeComm.showMessage("error", `Erro ao exportar PNG: ${msg}`);
    }
  };

  const handleExportPDF = async () => {
    try {
      const stageContainer = document.querySelector(".konvajs-content") as HTMLElement;
      if (!stageContainer) throw new Error("Container do diagrama não encontrado");

      await ExportService.exportToPDF(stageContainer, `diagrama-${diagramType}.pdf`);
      vsCodeComm.showMessage("info", "Diagrama exportado como PDF com sucesso!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      vsCodeComm.showMessage("error", `Erro ao exportar PDF: ${msg}`);
    }
  };

  // control preview
  const shouldShowPreview = diagramState.creationState === "placing";

  const handleDiagramTypeChange = (type: "usecase" | "activity") => {
    setDiagramType(type);
    diagramState.setDiagram({
      metadata: {
        version: "1.0",
        name: "Novo Diagrama",
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        type,
      },
      elements: [],
      relationships: [],
    });
  };

  // DELETE flow: request -> if needs confirm show dialog -> execute
  const handleDeleteRequest = (id: string) => {
    const prepared = operations.prepareDeleteElement(id);
    if (prepared.needsConfirm) {
      setConfirmState({
        open: true,
        message: `O elemento possui ${prepared.relatedCount} ligação(ões). Deseja excluir o elemento e todas as suas ligações?`,
        onConfirm: () => {
          prepared.execute();
          setConfirmState({ open: false, message: '', onConfirm: undefined });
        }
      });
    } else {
      // execute immediately
      prepared.execute();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Toolbar
        tool={diagramState.tool}
        onToolChange={operations.handleToolChange}
        onToggleEdit={operations.handleToggleEdit}
        onSave={vsCodeComm.handleSave}
        onLoad={vsCodeComm.handleLoad}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        onDeleteRequested={() => {
          if (diagramState.selectedElement) handleDeleteRequest(diagramState.selectedElement);
        }}
        isEditing={diagramState.isEditing}
        selectedElement={diagramState.selectedElement}
        creationState={diagramState.creationState}
        connectionState={diagramState.connectionState}
        diagramType={diagramType}
        onDiagramTypeChange={handleDiagramTypeChange}
      />

      <Stage
        width={stageSize.width}
        height={stageSize.height}
        draggable
        onWheel={(e) => {
          handleStagePan(e);
          handleStageWheel(e);
        }}
        onClick={stageInteractions.handleStageClick}
        onTap={stageInteractions.handleStageClick}
        onDblClick={handleDoubleClick}
        onMouseMove={stageInteractions.handleMouseMove}
      >
        {/* GRID de fundo */}
        <Layer listening={false}>
          <GridBackground width={stageSize.width} height={stageSize.height} gridSize={25} />
        </Layer>

        {/* LAYER principal */}
        <Layer>
          {shouldShowPreview && (
            <ElementPreview
              tool={diagramState.tool}
              x={mousePosLocal.x}
              y={mousePosLocal.y}
              size={40}
              visible={true}
            />
          )}

          {/* Relacionamentos */}
          {diagramState.diagram.relationships.map((rel) => {
            const fromElement = diagramState.diagram.elements.find((e) => e.id === rel.from);
            const toElement = diagramState.diagram.elements.find((e) => e.id === rel.to);
            if (!fromElement || !toElement) return null;

            return (
              <UMLRelationshipComponent
                key={rel.id}
                relationship={rel}
                fromElement={fromElement}
                toElement={toElement}
                isSelected={diagramState.selectedElement === rel.id}
                onClick={operations.handleElementClick}
                diagramType={diagramType}
              />
            );
          })}

          {/* Elementos */}
          {diagramState.diagram.elements.map((element) => {
            if (diagramType === "usecase") {
              return (
                <UseCaseComponent
                  key={element.id}
                  element={element as UseCaseElement}
                  onDragMove={handleDragMove}
                  onDragEnd={operations.handleElementDragEnd}
                  onClick={operations.handleElementClick}
                  onTextEdit={operations.handleTextEdit}
                  isSelected={diagramState.selectedElement === element.id}
                />
              );
            } else if (diagramType === "activity") {
              return (
                <ActivityComponent
                  key={element.id}
                  element={element as ActivityElement}
                  onDragMove={handleDragMove}
                  onDragEnd={operations.handleElementDragEnd}
                  onClick={operations.handleElementClick}
                  onTextEdit={operations.handleTextEdit}
                  isSelected={diagramState.selectedElement === element.id}
                />
              );
            }
            return null;
          })}

          {/* Layer de debug opcional */}
          <DebugLayer diagram={diagramState.diagram} enabled={false} />
        </Layer>
      </Stage>

      <ConfirmDialog
        open={confirmState.open}
        title="Excluir elemento"
        message={confirmState.message}
        onCancel={() => setConfirmState({ open: false, message: '', onConfirm: undefined })}
        onConfirm={() => {
          confirmState.onConfirm?.();
        }}
      />
    </div>
  );
}
