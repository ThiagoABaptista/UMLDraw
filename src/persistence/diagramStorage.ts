import * as vscode from 'vscode';
import { UMLDiagram, DiagramFile, DiagramMetadata } from '../types/umlTypes';

export class DiagramStorage {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  // 📁 Salvar em arquivo .uml
  async saveToFile(diagram: UMLDiagram): Promise<boolean> {
    try {
      const uri = await vscode.window.showSaveDialog({
        filters: { 'UMLDraw': ['uml'] },
        defaultUri: vscode.Uri.file('diagram.uml'),
        saveLabel: 'Salvar Diagrama'
      });

      if (!uri) return false;

      const diagramFile: DiagramFile = {
        metadata: diagram.metadata || this.createDefaultMetadata(),
        elements: diagram.classes,
        relationships: diagram.relationships,
        viewport: { scale: 1, offset: { x: 0, y: 0 } }
      };

      const data = JSON.stringify(diagramFile, null, 2);
      await vscode.workspace.fs.writeFile(uri, Buffer.from(data));
      
      vscode.window.showInformationMessage('Diagrama salvo com sucesso!');
      return true;
    } catch (error) {
      vscode.window.showErrorMessage('Erro ao salvar diagrama: ' + error);
      return false;
    }
  }

  // 📁 Carregar de arquivo .uml
  async loadFromFile(): Promise<UMLDiagram | null> {
    try {
      const uris = await vscode.window.showOpenDialog({
        filters: { 'UMLDraw': ['uml'] },
        openLabel: 'Abrir Diagrama'
      });

      if (!uris || uris.length === 0) return null;

      const fileData = await vscode.workspace.fs.readFile(uris[0]);
      const diagramFile: DiagramFile = JSON.parse(fileData.toString());
      
      return {
        metadata: diagramFile.metadata,
        classes: diagramFile.elements,
        relationships: diagramFile.relationships
      };
    } catch (error) {
      vscode.window.showErrorMessage('Erro ao carregar diagrama: ' + error);
      return null;
    }
  }

  // 💾 Salvar no workspace storage (auto-recovery)
  async saveToWorkspace(diagram: UMLDiagram): Promise<void> {
    try {
      const recoveryData = {
        diagram: diagram,
        timestamp: Date.now()
      };
      await this.context.workspaceState.update('last_diagram', recoveryData);
    } catch (error) {
      console.error('Erro ao salvar no workspace:', error);
    }
  }

  // 💾 Carregar do workspace storage
  async loadFromWorkspace(): Promise<UMLDiagram | null> {
    try {
      const recoveryData = this.context.workspaceState.get<{
        diagram: UMLDiagram;
        timestamp: number;
      }>('last_diagram');

      if (recoveryData && this.isRecent(recoveryData.timestamp)) {
        return recoveryData.diagram;
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar do workspace:', error);
      return null;
    }
  }

  // 💾 Salvar como template
  async saveAsTemplate(diagram: UMLDiagram, templateName: string): Promise<void> {
    try {
      const templates = this.context.globalState.get<{[key: string]: UMLDiagram}>('templates') || {};
      templates[templateName] = diagram;
      await this.context.globalState.update('templates', templates);
    } catch (error) {
      vscode.window.showErrorMessage('Erro ao salvar template: ' + error);
    }
  }

  // 💾 Carregar template
  async loadTemplate(templateName: string): Promise<UMLDiagram | null> {
    try {
      const templates = this.context.globalState.get<{[key: string]: UMLDiagram}>('templates') || {};
      return templates[templateName] || null;
    } catch (error) {
      vscode.window.showErrorMessage('Erro ao carregar template: ' + error);
      return null;
    }
  }

  // 📋 Listar templates
  async listTemplates(): Promise<string[]> {
    const templates = this.context.globalState.get<{[key: string]: UMLDiagram}>('templates') || {};
    return Object.keys(templates);
  }

  private createDefaultMetadata(): DiagramMetadata {
    return {
      version: '1.0',
      name: 'Novo Diagrama',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      type: 'class'
    };
  }

  private isRecent(timestamp: number): boolean {
    // Considera válido por 24 horas
    return Date.now() - timestamp < 24 * 60 * 60 * 1000;
  }
}