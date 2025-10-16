import { ExportService } from "../services/exportService";
import { UMLDiagram } from "../types/umlTypes";
import { useVSCodeCommunication } from "./useVSCodeCommunication";

export const useExportHandlers = (diagram: UMLDiagram, showMessage: (type: 'info' | 'error', text: string) => void) => {
  // 📤 Exportar PNG
  const handleExportPNG = async () => {
    try {
      const stageContainer = document.querySelector(".konvajs-content") as HTMLElement;
      if (!stageContainer) throw new Error("Container do diagrama não encontrado");

      await ExportService.exportToPNG(stageContainer, `${diagram.metadata.name || "diagrama"}.png`);
      showMessage("info", "Diagrama exportado como PNG com sucesso!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      showMessage("error", `Erro ao exportar PNG: ${msg}`);
    }
  };

  // 📄 Exportar PDF (com suporte a comentários)
  const handleExportPDF = async () => {
    try {
      const stageContainer = document.querySelector(".konvajs-content") as HTMLElement;
      if (!stageContainer) throw new Error("Container do diagrama não encontrado");

      // Envia também os comentários, se houver
      await ExportService.exportToPDF(
        stageContainer,
        `${diagram.metadata.name || "diagrama"}.pdf`,
        diagram.metadata.comments
      );

      showMessage("info", "Diagrama exportado como PDF com sucesso!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      showMessage("error", `Erro ao exportar PDF: ${msg}`);
    }
  };

  return {
    handleExportPNG,
    handleExportPDF
  };
};
