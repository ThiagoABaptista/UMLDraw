import { useCallback, useEffect } from "react";
import { UMLDiagram } from "../types/umlTypes";

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

const showMessage = (type: "info" | "error", text: string) => {
  vscodePostMessage({
    command: type === "info" ? "showInfo" : "showError",
    text,
  });
};

/**
 * Hook para comunicação com o VSCode Webview.
 */
export const useVSCodeCommunication = (
  diagram: UMLDiagram,
  diagramType: "usecase" | "activity",
  onDiagramLoaded: (diagram: UMLDiagram) => void,
  getFileName?: () => string
) => {
  const buildDiagramPayload = useCallback(() => {
    return {
      ...diagram,
      metadata: {
        version: diagram.metadata?.version || "1.0",
        name: diagram.metadata?.name || "Novo Diagrama",
        created: diagram.metadata?.created || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        type: diagramType,
        comments: diagram.metadata?.comments || "",
      },
    };
  }, [diagram, diagramType]);

  const handleSaveToFile = useCallback(() => {
    const fileName = getFileName ? getFileName() : `${diagram.metadata.name || "Diagrama"}.uml`;

    vscodePostMessage({
      command: "saveToFile",
      diagram: buildDiagramPayload(),
      fileName,
    });
  }, [diagram, getFileName, buildDiagramPayload]);

  const handleSaveToWorkspace = useCallback(() => {
    vscodePostMessage({
      command: "saveToWorkspace",
      diagram: buildDiagramPayload(),
    });
  }, [diagram, buildDiagramPayload]);

  const handleSave = useCallback(() => {
    const fileName = getFileName ? getFileName() : `${diagram.metadata.name || "Diagrama"}.uml`;

    vscodePostMessage({
      command: "saveToFile",
      diagram: buildDiagramPayload(),
      fileName,
    });
  }, [diagram, getFileName, buildDiagramPayload]);

  const handleSaveAs = useCallback(() => {
    const fileName = getFileName ? getFileName() : `${diagram.metadata.name || "Diagrama"}.uml`;

    vscodePostMessage({
      command: "saveAsFile", // comando separado
      diagram: buildDiagramPayload(),
      fileName,
    });
  }, [diagram, getFileName, buildDiagramPayload]);

  const handleLoad = useCallback(() => {
    vscodePostMessage({ command: "requestLoad" });
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      switch (message.command) {
        case "saveDiagram":
          handleSaveToFile();
          break;

        case "loadDiagram":
        case "loadInitialDiagram":
          if (message.diagram) {
            onDiagramLoaded(message.diagram);
          }
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    vscodePostMessage({ command: "requestInitialDiagram" });

    return () => window.removeEventListener("message", handleMessage);
  }, [handleSaveToFile, onDiagramLoaded]);

  return {
    handleSaveToFile,
    handleSaveToWorkspace,
    handleSave,
    handleSaveAs,
    handleLoad,
    showMessage,
  };
};
