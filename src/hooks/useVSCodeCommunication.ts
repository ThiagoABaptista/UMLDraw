import { useCallback, useEffect } from "react";
import { UMLDiagram, UMLProject } from "../types/umlTypes";

declare global {
  interface Window {
    vscode?: { postMessage: (message: any) => void };
  }
}

const vscodePostMessage = (message: any) => {
  if (window.vscode) window.vscode.postMessage(message);
};

const showMessage = (type: "info" | "error", text: string) => {
  vscodePostMessage({
    command: type === "info" ? "showInfo" : "showError",
    text,
  });
};

/**
 * Hook de comunicação entre o VSCode e o Webview.
 * Suporta diagramas únicos (.uml) e projetos múltiplos (.umlproj)
 */
export const useVSCodeCommunication = (
  diagram: UMLDiagram,
  diagramType: "usecase" | "activity",
  onDataLoaded: (data: UMLDiagram | UMLProject) => void,
  getFileName?: () => string
) => {
  const buildDiagramPayload = useCallback(
    () => ({
      ...diagram,
      metadata: {
        version: diagram.metadata?.version || "1.0",
        name: diagram.metadata?.name || "Novo Diagrama",
        created: diagram.metadata?.created || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        type: diagramType,
        comments: diagram.metadata?.comments || "",
      },
    }),
    [diagram, diagramType]
  );

  /** Salvar diagrama simples (.uml) */
  const handleSaveToFile = useCallback(() => {
    const fileName = getFileName ? getFileName() : `${diagram.metadata.name || "Diagrama"}.uml`;
    vscodePostMessage({ command: "saveToFile", diagram: buildDiagramPayload(), fileName });
  }, [diagram, getFileName, buildDiagramPayload]);

  /** Salvar como novo (.uml) */
  const handleSaveAs = useCallback(() => {
    const fileName = getFileName ? getFileName() : `${diagram.metadata.name || "Diagrama"}.uml`;
    vscodePostMessage({ command: "saveAsFile", diagram: buildDiagramPayload(), fileName });
  }, [diagram, getFileName, buildDiagramPayload]);

  /** Salvar projeto (.umlproj) */
  const handleSaveProject = useCallback((project: UMLProject) => {
    vscodePostMessage({
      command: "saveProject",
      project,
      fileName: `${project.name || "Projeto"}.umlproj`,
    });
  }, []);

  /** Carregar arquivo */
  const handleLoad = useCallback(() => {
    vscodePostMessage({ command: "requestLoad" });
  }, []);

  /** Carregar projeto completo */
  const handleLoadProject = useCallback(() => {
    vscodePostMessage({ command: "requestLoadProject" });
  }, []);

  /** Listener para mensagens */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      switch (message.command) {
        case "loadDiagram":
        case "loadInitialDiagram":
        case "loadProject":
          if (message.diagram || message.project) {
            onDataLoaded(message.diagram || message.project);
          }
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    vscodePostMessage({ command: "requestInitialDiagram" });

    return () => window.removeEventListener("message", handleMessage);
  }, [onDataLoaded]);

  return {
    handleSaveToFile,
    handleSaveAs,
    handleSaveProject,
    handleLoad,
    handleLoadProject,
    showMessage,
  };
};
