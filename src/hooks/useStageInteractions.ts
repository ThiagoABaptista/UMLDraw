import { useCallback, useEffect } from "react";
import {
  Tool,
  UseCaseElement,
  ActivityElement,
  UMLDiagram,
  CreationState,
  ConnectionState,
} from "../types/umlTypes";

interface StageInteractionsProps {
  creationState: CreationState;
  tool: Tool;
  connectionState: ConnectionState;
  createNewElement: (tool: Tool, x: number, y: number) => UseCaseElement | ActivityElement;
  updateDiagram: (updater: (prev: UMLDiagram) => UMLDiagram) => void;
  setSelectedElement: (id: string | null) => void;
  setCreationState: (state: CreationState) => void;
  setTool: (tool: Tool) => void;
  setConnectionState: (state: ConnectionState) => void;
  setConnectionStart: (id: string | null) => void;
  clearEditingState: () => void;
  onMousePositionChange?: (pos: { x: number; y: number }) => void;
}

export const useStageInteractions = (props: StageInteractionsProps) => {
  const {
    creationState,
    tool,
    connectionState,
    createNewElement,
    updateDiagram,
    setSelectedElement,
    setCreationState,
    setTool,
    setConnectionState,
    setConnectionStart,
    clearEditingState,
    onMousePositionChange,
  } = props;

  const getCanvasCoords = (stage: any) => {
    const pointer = stage.getPointerPosition();
    if (!pointer) return { x: 0, y: 0 };

    const scale = stage.scaleX();
    const stageX = stage.x();
    const stageY = stage.y();

    return {
      x: (pointer.x - stageX) / scale,
      y: (pointer.y - stageY) / scale,
    };
  };

  const handleStageClick = useCallback(
    (e: any) => {
      const stage = e.target.getStage();
      if (!stage) return;

      // Se clicar no canvas vazio
      if (e.target === stage) {
        // Cria novo elemento (modo criação)
        if (creationState === "placing" && tool !== "select" && tool !== "relationship") {
          const pos = getCanvasCoords(stage);
          const newElement = createNewElement(tool, pos.x, pos.y);

          updateDiagram((prev: UMLDiagram) => ({
            ...prev,
            elements: [...prev.elements, newElement],
          }));

          setSelectedElement(newElement.id);
          setCreationState("idle");
          setTool("select");
          return;
        }

        // Cancela conexão, edição, e limpa seleção
        if (connectionState !== "idle") {
          setConnectionState("idle");
          setConnectionStart(null);
        }

        clearEditingState();
        setSelectedElement(null); // 👉 mostra infos do diagrama
      }
    },
    [
      creationState,
      tool,
      connectionState,
      createNewElement,
      updateDiagram,
      setSelectedElement,
      setCreationState,
      setTool,
      setConnectionState,
      setConnectionStart,
      clearEditingState,
    ]
  );

  const handleMouseMove = useCallback(
    (e: any) => {
      const stage = e.target.getStage();
      if (!stage || !onMousePositionChange) return;

      const pos = getCanvasCoords(stage);
      onMousePositionChange(pos);
    },
    [onMousePositionChange]
  );

  useEffect(() => {
    const cancelListener = () => {
      setCreationState("idle");
      setTool("select");
      setConnectionState("idle");
      setConnectionStart(null);
      clearEditingState();
      setSelectedElement(null);
    };

    window.addEventListener("cancel-creation", cancelListener);
    return () => window.removeEventListener("cancel-creation", cancelListener);
  }, [
    setCreationState,
    setTool,
    setConnectionState,
    setConnectionStart,
    clearEditingState,
    setSelectedElement,
  ]);

  return { handleStageClick, handleMouseMove };
};
