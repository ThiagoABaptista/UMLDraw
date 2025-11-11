import { useState, useCallback } from "react";
import {
  UMLDiagram,
  Tool,
  CreationState,
  ConnectionState,
  UseCaseElement,
  ActivityElement,
  UMLRelationship,
} from "../types/umlTypes";
import { RelationshipType } from "../types/umlTypes";
import { getElementDefaults } from "../utils/diagramDefaults";

const initialDiagram: UMLDiagram = {
  metadata: {
    version: "1.0",
    name: "Diagrama 1",
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    type: "usecase",
  },
  elements: [
    {
      id: "1",
      type: "actor",
      name: "Usuário",
      x: 100,
      y: 100,
      width: getElementDefaults("actor").width,
      height: getElementDefaults("actor").height,
    },
    {
      id: "2",
      type: "usecase",
      name: "Realizar Login",
      x: 300,
      y: 120,
      width: getElementDefaults("usecase").width,
      height: getElementDefaults("usecase").height,
    },
  ],
  relationships: [
    {
      id: "rel1",
      from: "1",
      to: "2",
      type: "association",
    },
  ],
};

export const useDiagramState = () => {
  const [diagram, setDiagram] = useState<UMLDiagram | null>(initialDiagram);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [isEditing, setIsEditing] = useState(false);
  const [creationState, setCreationState] = useState<CreationState>("idle");
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("idle");
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [selectedRelationshipType, setSelectedRelationshipType] =
    useState<RelationshipType>("association");

  const updateDiagram = useCallback((updater: (prev: UMLDiagram) => UMLDiagram) => {
    setDiagram((prev) => (prev ? updater(prev) : initialDiagram));
  }, []);

  const clearEditingState = useCallback(() => {
    setDiagram((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        elements: prev.elements.map((element) => ({
          ...element,
          isEditing: false,
        })),
      };
    });
    setIsEditing(false);
  }, []);

  return {
    diagram: diagram ?? initialDiagram,
    selectedElement,
    tool,
    isEditing,
    creationState,
    connectionState,
    connectionStart,
    selectedRelationshipType,
    setSelectedRelationshipType,
    setDiagram,
    setSelectedElement,
    setTool,
    setIsEditing,
    setCreationState: setCreationState as (state: CreationState) => void,
    setConnectionState: setConnectionState as (state: ConnectionState) => void,
    setConnectionStart,
    updateDiagram,
    clearEditingState,
  };
};
