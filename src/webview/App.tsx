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
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { ExportService } from "../services/exportService";
import { UMLDiagram, UseCaseElement, ActivityElement, UMLRelationship } from "../types/umlTypes";
import { GridBackground } from "../components/GridBackground";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Sidebar } from "../components/Sidebar";

export default function App() {
  const [diagramType, setDiagramType] = useState<"usecase" | "activity">("usecase");
  const [showSidebar, setShowSidebar] = useState(true);

  const diagramState = useDiagramState();
  const { mousePosition } = useMousePosition();
  const { handleStageWheel, handleStagePan, handleDoubleClick } = useStageZoom();
  const stageSize = useCanvasResize(50);
  const { handleDragMove } = useStageDragFeedback({ updateDiagram: diagramState.updateDiagram });
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
      selectedRelationshipType: diagramState.selectedRelationshipType,
    },
    diagramType
  );

  // Comunicação com VSCode
  const vsCodeComm = useVSCodeCommunication(
    diagramState.diagram,
    diagramType,
    (diagram) => {
      diagramState.setDiagram(diagram);
      setDiagramType(diagram.metadata.type);
    },
    () => `${diagramState.diagram.metadata.name || "Diagrama"}.uml`
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
    onMousePositionChange: setMousePosLocal,
  });

  const [confirmState, setConfirmState] = useState({
    open: false,
    message: "",
    onConfirm: undefined as (() => void) | undefined,
  });

  // Atalhos
  useKeyboardShortcuts({
    onDelete: () => {
      if (!diagramState.selectedElement) return;
      handleDeleteRequest(diagramState.selectedElement);
    },
  });

  const handleExportPNG = async () => {
    try {
      const stageContainer = document.querySelector(".konvajs-content") as HTMLElement;
      if (!stageContainer) throw new Error("Container do diagrama não encontrado");
      await ExportService.exportToPNG(stageContainer, `${diagramState.diagram.metadata.name || "diagrama"}.png`);
      vsCodeComm.showMessage("info", "Diagrama exportado como PNG com sucesso!");
    } catch (error) {
      vsCodeComm.showMessage("error", `Erro ao exportar PNG: ${(error as Error).message}`);
    }
  };

  const handleExportPDF = async () => {
    try {
      const stageContainer = document.querySelector(".konvajs-content") as HTMLElement;
      if (!stageContainer) throw new Error("Container do diagrama não encontrado");
      await ExportService.exportToPDF(
        stageContainer,
        `${diagramState.diagram.metadata.name || "diagrama"}.pdf`,
        diagramState.diagram.metadata.comments || ""
      );
      vsCodeComm.showMessage("info", "Diagrama exportado como PDF com sucesso!");
    } catch (error) {
      vsCodeComm.showMessage("error", `Erro ao exportar PDF: ${(error as Error).message}`);
    }
  };

  const handleDiagramTypeChange = (type: "usecase" | "activity") => {
    setDiagramType(type);
    diagramState.setTool("select");
    diagramState.setSelectedRelationshipType(type === "usecase" ? "association" : "control_flow");
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

  const handleDeleteRequest = (id: string) => {
    const prepared = operations.prepareDeleteItem(id);
    if (prepared.needsConfirm) {
      setConfirmState({
        open: true,
        message: `O elemento possui ${prepared.relatedCount} ligação(ões). Deseja excluir o elemento e todas as suas ligações?`,
        onConfirm: () => {
          prepared.execute();
          setConfirmState({ open: false, message: "", onConfirm: undefined });
        },
      });
    } else {
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
        onSaveAs={vsCodeComm.handleSaveAs}
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
        selectedRelationshipType={diagramState.selectedRelationshipType}
        onRelationshipTypeChange={diagramState.setSelectedRelationshipType}
        onDiagramTypeChange={handleDiagramTypeChange}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        showSidebar={showSidebar}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: "1 1 auto", position: "relative", overflow: "hidden" }}>
          <Stage
            width={showSidebar ? stageSize.width - 280 : stageSize.width}
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
            <Layer listening={false}>
              <GridBackground width={stageSize.width} height={stageSize.height} gridSize={25} />
            </Layer>

            <Layer>
              {diagramState.diagram.relationships.map((rel) => {
                const from = diagramState.diagram.elements.find((e) => e.id === rel.from);
                const to = diagramState.diagram.elements.find((e) => e.id === rel.to);
                if (!from || !to) return null;
                return (
                  <UMLRelationshipComponent
                    key={rel.id}
                    relationship={rel}
                    fromElement={from}
                    toElement={to}
                    isSelected={diagramState.selectedElement === rel.id}
                    onClick={operations.handleElementClick}
                    diagramType={diagramType}
                  />
                );
              })}

              {diagramState.diagram.elements.map((el) =>
                diagramType === "usecase" ? (
                  <UseCaseComponent
                    key={el.id}
                    element={el as UseCaseElement}
                    onDragMove={handleDragMove}
                    onDragEnd={operations.handleElementDragEnd}
                    onClick={operations.handleElementClick}
                    onTextEdit={operations.handleTextEdit}
                    isSelected={diagramState.selectedElement === el.id}
                  />
                ) : (
                  <ActivityComponent
                    key={el.id}
                    element={el as ActivityElement}
                    onDragMove={handleDragMove}
                    onDragEnd={operations.handleElementDragEnd}
                    onClick={operations.handleElementClick}
                    onTextEdit={operations.handleTextEdit}
                    isSelected={diagramState.selectedElement === el.id}
                  />
                )
              )}
            </Layer>
          </Stage>
        </div>

        {showSidebar && (
          <Sidebar
            selectedId={diagramState.selectedElement}
            diagram={diagramState.diagram}
            onUpdate={(d) => diagramState.updateDiagram(() => d)}
            onClearSelection={() => diagramState.setSelectedElement(null)}
          />
        )}
      </div>

      <ConfirmDialog
        open={confirmState.open}
        title="Excluir elemento"
        message={confirmState.message}
        onCancel={() => setConfirmState({ open: false, message: "", onConfirm: undefined })}
        onConfirm={() => confirmState.onConfirm?.()}
      />
    </div>
  );
}
