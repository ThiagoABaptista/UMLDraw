import { UMLDiagram } from "../types/umlTypes";

export const useDiagramHandlers = (updateTool: (tool: string) => void, setSelectedRelationshipType: (type: string) => void, setDiagram: (diagram: UMLDiagram) => void) => {
  const handleDiagramTypeChange = (type: "usecase" | "activity") => {
    updateTool("select");
    setSelectedRelationshipType(type === "usecase" ? "association" : "control_flow");

    setDiagram({
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

  return { handleDiagramTypeChange };
};
