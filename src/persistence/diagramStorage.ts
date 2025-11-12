import * as vscode from "vscode";
import { UMLDiagram, DiagramFile, DiagramMetadata } from "../types/umlTypes";

/**
 * Classe responsável por salvar e carregar diagramas e projetos UML.
 * Agora suporta:
 *  - .uml → diagrama único
 *  - .umlproj → múltiplos diagramas em um projeto
 */
export class DiagramStorage {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  // =====================================================
  // SALVAR DIAGRAMA / PROJETO
  // =====================================================

  /**
   * Salva diagrama (.uml) ou projeto (.umlproj)
   * @param data UMLDiagram ou objeto de projeto { name, diagrams: UMLDiagram[] }
   * @param format "uml" (padrão) ou "umlproj"
   */
  async saveToFile(data: UMLDiagram | any, format: "uml" | "umlproj" = "uml"): Promise<boolean> {
    try {
      const defaultName =
        (data.metadata?.name ?? data.name ?? "diagrama").trim() || "diagrama";
      const extension = format === "umlproj" ? "umlproj" : "uml";

      const uri = await vscode.window.showSaveDialog({
        filters: { UMLDraw: [extension] },
        defaultUri: vscode.Uri.file(`${defaultName}.${extension}`),
        saveLabel: format === "umlproj" ? "Salvar Projeto UML" : "Salvar Diagrama UML",
      });

      if (!uri) return false;

      // Criação do arquivo conforme o tipo
      let content: string;

      if (format === "umlproj") {
        const projectData = {
          version: "1.0",
          name: data.name || "Projeto UML",
          created: data.created || new Date().toISOString(),
          lastModified: new Date().toISOString(),
          diagrams: data.diagrams || [],
        };
        content = JSON.stringify(projectData, null, 2);
      } else {
        const diagram: UMLDiagram = data;
        const diagramFile: DiagramFile = {
          metadata: diagram.metadata || this.createDefaultMetadata(),
          elements: diagram.elements,
          relationships: diagram.relationships,
          viewport: { scale: 1, offset: { x: 0, y: 0 } },
        };
        diagramFile.metadata.lastModified = new Date().toISOString();
        content = JSON.stringify(diagramFile, null, 2);
      }

      await vscode.workspace.fs.writeFile(uri, Buffer.from(content, "utf-8"));
      vscode.window.showInformationMessage(
        format === "umlproj"
          ? "Projeto UML salvo com sucesso!"
          : "Diagrama UML salvo com sucesso!"
      );
      return true;
    } catch (error) {
      vscode.window.showErrorMessage("Erro ao salvar arquivo: " + error);
      return false;
    }
  }

  // =====================================================
  // CARREGAR DIAGRAMA / PROJETO
  // =====================================================

  /**
   * Carrega um diagrama (.uml) ou um projeto (.umlproj)
   */
  async loadFromFile(format: "uml" | "umlproj" = "uml"): Promise<UMLDiagram | any | null> {
    try {
      const filters = { UMLDraw: [format] };
      const openLabel = format === "umlproj" ? "Abrir Projeto UML" : "Abrir Diagrama UML";

      const uris = await vscode.window.showOpenDialog({ filters, openLabel });
      if (!uris || uris.length === 0) return null;

      const fileData = await vscode.workspace.fs.readFile(uris[0]);
      const parsed = JSON.parse(fileData.toString());

      if (format === "umlproj") {
        if (Array.isArray(parsed.diagrams)) {
          vscode.window.showInformationMessage("Projeto UML carregado com sucesso!");
          return parsed;
        } else {
          vscode.window.showErrorMessage("Formato de projeto inválido.");
          return null;
        }
      }

      // Migra formato antigo (.uml)
      const diagramFile: DiagramFile = parsed;
      return this.migrateDiagram(diagramFile);
    } catch (error) {
      vscode.window.showErrorMessage("Erro ao carregar arquivo: " + error);
      return null;
    }
  }

  // =====================================================
  // WORKSPACE STORAGE
  // =====================================================

  async saveToWorkspace(diagram: UMLDiagram): Promise<void> {
    try {
      const recoveryData = { diagram, timestamp: Date.now() };
      await this.context.workspaceState.update("last_diagram", recoveryData);
    } catch (error) {
      console.error("Erro ao salvar no workspace:", error);
    }
  }

  async loadFromWorkspace(): Promise<UMLDiagram | null> {
    try {
      const recoveryData = this.context.workspaceState.get<{
        diagram: UMLDiagram;
        timestamp: number;
      }>("last_diagram");

      if (recoveryData && this.isRecent(recoveryData.timestamp)) {
        return recoveryData.diagram;
      }
      return null;
    } catch (error) {
      console.error("Erro ao carregar do workspace:", error);
      return null;
    }
  }

  // =====================================================
  // TEMPLATES E METADADOS
  // =====================================================

  async saveAsTemplate(diagram: UMLDiagram, templateName: string): Promise<void> {
    try {
      const templates =
        this.context.globalState.get<{ [key: string]: UMLDiagram }>("templates") || {};
      templates[templateName] = diagram;
      await this.context.globalState.update("templates", templates);
    } catch (error) {
      vscode.window.showErrorMessage("Erro ao salvar template: " + error);
    }
  }

  async loadTemplate(templateName: string): Promise<UMLDiagram | null> {
    try {
      const templates =
        this.context.globalState.get<{ [key: string]: UMLDiagram }>("templates") || {};
      return templates[templateName] || null;
    } catch (error) {
      vscode.window.showErrorMessage("Erro ao carregar template: " + error);
      return null;
    }
  }

  async listTemplates(): Promise<string[]> {
    const templates =
      this.context.globalState.get<{ [key: string]: UMLDiagram }>("templates") || {};
    return Object.keys(templates);
  }

  private createDefaultMetadata(): DiagramMetadata {
    return {
      version: "1.0",
      name: "Novo Diagrama",
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      type: "usecase",
    };
  }

  private isRecent(timestamp: number): boolean {
    // 24h de validade
    return Date.now() - timestamp < 24 * 60 * 60 * 1000;
  }

  private migrateDiagram(diagramFile: DiagramFile): UMLDiagram {
    const metadata = diagramFile.metadata || this.createDefaultMetadata();
    return {
      metadata: {
        ...metadata,
        comments: metadata.comments || (diagramFile as any).comments || "",
      },
      elements: diagramFile.elements || [],
      relationships: diagramFile.relationships || [],
    };
  }
}
