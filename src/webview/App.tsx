import React, { useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { Toolbar } from "../components/Toolbar";
import { UMLRelationshipComponent } from "../components/UMLRelationship";
import { UseCaseComponent } from "../components/UseCaseComponent";
import { ActivityComponent } from "../components/ActivityComponent";
import { GridBackground } from "../components/GridBackground";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Sidebar } from "../components/Sidebar";
import { useDiagramState } from "../hooks/useDiagramState";
import { useDiagramOperations } from "../hooks/useDiagramOperations";
import { useVSCodeCommunication } from "../hooks/useVSCodeCommunication";
import { useStageInteractions } from "../hooks/useStageInteractions";
import { useCanvasResize } from "../hooks/useCanvasResize";
import { useStageZoom } from "../hooks/useStageZoom";
import { useStageDragFeedback } from "../hooks/useStageDragFeedback";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { ExportService } from "../services/exportService";
import { UMLDiagram, UMLProject, UseCaseElement, ActivityElement } from "../types/umlTypes";
import { EditableTitle } from "../components/EditableTitle";
import { DiagramTabs } from "../components/DiagramTabs";
import { ElementPreview } from "../components/ElementPreview";

export default function App() {
  const diagramState = useDiagramState();

  const [project, setProject] = useState<UMLProject>({
    version: "1.0",
    name: "Novo Projeto UML",
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    diagrams: [diagramState.diagram],
  });

  const [activeDiagramIndex, setActiveDiagramIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [confirmDeleteDiagram, setConfirmDeleteDiagram] = useState<{ open: boolean; index?: number }>({ open: false });
  const [confirmResetDiagram, setConfirmResetDiagram] = useState<{ open: boolean; type?: "usecase" | "activity" }>({
    open: false,
  });

  const stageSize = useCanvasResize(50);
  const { handleStageWheel, handleStagePan } = useStageZoom();
  const { handleDragMove } = useStageDragFeedback({ updateDiagram: diagramState.updateDiagram });

  // === Diagramas e operações ===
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
    diagramState.diagram.metadata.type
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
  });

  // === Comunicação com VSCode ===
  const vsCodeComm = useVSCodeCommunication(
    diagramState.diagram,
    diagramState.diagram.metadata.type,
    (data) => {
      if ((data as UMLProject).diagrams) {
        const projectData = data as UMLProject;
        setProject(projectData);
        diagramState.setDiagram(projectData.diagrams[0]);
        setActiveDiagramIndex(0);
      } else {
        diagramState.setDiagram(data as UMLDiagram);
        setProject({
          ...project,
          diagrams: [data as UMLDiagram],
        });
        setActiveDiagramIndex(0);
      }
    }
  );

  // === Alternar entre diagramas ===
  const handleSwitchDiagram = (index: number) => {
    if (index < 0 || index >= project.diagrams.length) return;
    const targetDiagram = project.diagrams[index];
    setActiveDiagramIndex(index);
    diagramState.setDiagram(targetDiagram);
  };

  // === Atualiza projeto quando o diagrama atual muda ===
  useEffect(() => {
    setProject((prev) => {
      if (!prev.diagrams.length) return prev;
      const updated = [...prev.diagrams];
      updated[activeDiagramIndex] = diagramState.diagram;
      return { ...prev, diagrams: updated, lastModified: new Date().toISOString() };
    });
  }, [diagramState.diagram, activeDiagramIndex]);

  // === Resetar estado do diagrama ===
  const resetDiagramState = (type: "usecase" | "activity") => {
    const newDiagram: UMLDiagram = {
      metadata: {
        version: "1.0",
        name: `Novo Diagrama de ${type === "usecase" ? "Casos de Uso" : "Atividades"}`,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        type,
        comments: "",
      },
      elements: [],
      relationships: [],
    };

    diagramState.setDiagram(newDiagram);
    setProject((prev) => {
      const updated = [...prev.diagrams];
      updated[activeDiagramIndex] = newDiagram;
      return { ...prev, diagrams: updated, lastModified: new Date().toISOString() };
    });
  };

  // === Novo diagrama ===
  const handleNewDiagram = () => {
    const newDiagram: UMLDiagram = {
      metadata: {
        version: "1.0",
        name: `Diagrama ${project.diagrams.length + 1}`,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        type: "usecase",
        comments: "",
      },
      elements: [],
      relationships: [],
    };
    setProject((prev) => ({ ...prev, diagrams: [...prev.diagrams, newDiagram] }));
    setActiveDiagramIndex(project.diagrams.length);
    diagramState.setDiagram(newDiagram);
  };

  // === Deletar diagrama ===
  const handleDeleteDiagram = (index: number) => {
    if (project.diagrams.length === 1) {
      vsCodeComm.showMessage("error", "O projeto deve conter pelo menos um diagrama.");
      return;
    }
    setConfirmDeleteDiagram({ open: true, index });
  };

  const confirmDelete = () => {
    const index = confirmDeleteDiagram.index!;
    const updated = project.diagrams.filter((_, i) => i !== index);
    const newIndex = index >= updated.length ? updated.length - 1 : index;
    setProject({ ...project, diagrams: updated });
    setActiveDiagramIndex(newIndex);
    diagramState.setDiagram(updated[newIndex]);
    setConfirmDeleteDiagram({ open: false });
  };

  // === Exportações ===
  const handleExportPNG = async () => {
    const stageContainer = document.querySelector(".konvajs-content") as HTMLElement;
    if (stageContainer) {
      await ExportService.exportToPNG(stageContainer, `${diagramState.diagram.metadata.name}.png`);
      vsCodeComm.showMessage("info", "Exportado como PNG com sucesso!");
    }
  };

  const handleExportPDF = async () => {
    const stageContainer = document.querySelector(".konvajs-content") as HTMLElement;
    if (stageContainer) {
      await ExportService.exportToPDF(
        stageContainer,
        `${diagramState.diagram.metadata.name}.pdf`,
        diagramState.diagram.metadata.comments || ""
      );
      vsCodeComm.showMessage("info", "Exportado como PDF com sucesso!");
    }
  };

  // === Exclusão de elementos ===
  const [confirmState, setConfirmState] = useState({
    open: false,
    message: "",
    onConfirm: undefined as (() => void) | undefined,
  });

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

  // ===  Atalhos ===
  useKeyboardShortcuts({
    onDelete: () => {
      if (diagramState.selectedElement) handleDeleteRequest(diagramState.selectedElement);
    },

    onEscape: () => {
      // Se estiver criando um elemento → cancelar
      if (diagramState.creationState === "placing") {
        diagramState.setCreationState("idle");
        diagramState.setTool("select");
        vsCodeComm.showMessage("info", "Criação de elemento cancelada.");
        return;
      }

      // Se estiver criando uma relação → cancelar
      if (diagramState.connectionState !== "idle") {
        diagramState.setConnectionState("idle");
        diagramState.setConnectionStart(null);
        diagramState.setTool("select");
        vsCodeComm.showMessage("info", "Criação de relacionamento cancelada.");
        return;
      }

      // Caso contrário → apenas limpa seleção
      diagramState.setSelectedElement(null);
      diagramState.clearEditingState();
    },

    onSave: () => vsCodeComm.handleSaveProject(project),
    onNewDiagram: handleNewDiagram,
  });

  // === Alterar tipo de diagrama ===
  const handleChangeDiagramType = (newType: "usecase" | "activity") => {
    if (newType === diagramState.diagram.metadata.type) return;

    const hasElements =
      diagramState.diagram.elements.length > 0 || diagramState.diagram.relationships.length > 0;

    if (hasElements) {
      setConfirmResetDiagram({ open: true, type: newType });
    } else {
      resetDiagramState(newType);
    }
  };

  return (
    <div className="app-container">
      {/* Toolbar */}
      <Toolbar
        tool={diagramState.tool}
        onToolChange={operations.handleToolChange}
        onSave={() => vsCodeComm.handleSaveProject(project)}
        onLoad={() => vsCodeComm.handleLoadProject()}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        onDeleteRequested={() =>
          diagramState.selectedElement && handleDeleteRequest(diagramState.selectedElement)
        }
        selectedElement={diagramState.selectedElement}
        creationState={diagramState.creationState}
        connectionState={diagramState.connectionState}
        diagramType={diagramState.diagram.metadata.type}
        selectedRelationshipType={diagramState.selectedRelationshipType}
        onRelationshipTypeChange={diagramState.setSelectedRelationshipType}
        onDiagramTypeChange={handleChangeDiagramType}
        onToggleSidebar={() => setShowSidebar((p) => !p)}
        showSidebar={showSidebar}
        onNewDiagram={handleNewDiagram}
        projectName={project.name}
        onProjectNameChange={(newName) =>
          setProject((prev) => ({ ...prev, name: newName, lastModified: new Date().toISOString() }))
        }
      />

      {/* Abas de diagramas */}
      <DiagramTabs
        diagrams={project.diagrams}
        activeIndex={activeDiagramIndex}
        onSwitch={handleSwitchDiagram}
        onNew={handleNewDiagram}
        onDelete={handleDeleteDiagram}
      />

      {/* Canvas + Sidebar */}
      <div className="app-main">
        <div className="canvas-container">
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
                    diagramType={diagramState.diagram.metadata.type}
                  />
                );
              })}

              {diagramState.diagram.elements.map((el) =>
                diagramState.diagram.metadata.type === "usecase" ? (
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
              <ElementPreview
                tool={diagramState.tool}
                x={stageInteractions.previewPosition?.x || 0}
                y={stageInteractions.previewPosition?.y || 0}
                visible={diagramState.creationState === "placing"}
              />
            </Layer>
          </Stage>
        </div>

        {showSidebar && (
          <Sidebar
            selectedId={diagramState.selectedElement}
            diagram={diagramState.diagram}
            onUpdate={(d) => diagramState.updateDiagram(() => d)}
            onSelect={diagramState.setSelectedElement}
            onClearSelection={() => diagramState.setSelectedElement(null)}
          />
        )}
      </div>

      {/* Diálogos de confirmação */}
      <ConfirmDialog
        open={confirmState.open}
        title="Excluir elemento"
        message={confirmState.message}
        onCancel={() => setConfirmState({ open: false, message: "", onConfirm: undefined })}
        onConfirm={() => confirmState.onConfirm?.()}
      />

      <ConfirmDialog
        open={confirmDeleteDiagram.open}
        title="Excluir diagrama"
        message={`Tem certeza que deseja excluir o diagrama "${project.diagrams[confirmDeleteDiagram.index!]?.metadata.name}"?`}
        onCancel={() => setConfirmDeleteDiagram({ open: false })}
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={confirmResetDiagram.open}
        title="Alterar tipo de diagrama"
        message="Alterar o tipo de diagrama apagará todos os elementos atuais. Deseja continuar?"
        onCancel={() => setConfirmResetDiagram({ open: false })}
        onConfirm={() => {
          if (confirmResetDiagram.type) resetDiagramState(confirmResetDiagram.type);
          setConfirmResetDiagram({ open: false });
        }}
      />
    </div>
  );
}
