import { DiagramStorage } from "../../src/persistence/diagramStorage";
import * as vscode from "vscode";
import { UMLDiagram } from "../../src/types/umlTypes";

// Mock do contexto do VSCode
const mockContext = {
  workspaceState: {
    update: jest.fn(),
    get: jest.fn(),
  },
  globalState: {
    update: jest.fn(),
    get: jest.fn(),
  },
} as any;

// Simulação de um diagrama básico
const mockDiagram: UMLDiagram = {
  metadata: {
    version: "1.0",
    name: "Diagrama Teste",
    created: "2024-01-01T00:00:00Z",
    lastModified: "2024-01-01T00:00:00Z",
    type: "usecase",
  },
  elements: [],
  relationships: [],
};

describe("DiagramStorage", () => {
  let storage: DiagramStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    storage = new DiagramStorage(mockContext);
  });

  // =====================================================
  // SALVAR ARQUIVOS
  // =====================================================

  it("salva um diagrama .uml corretamente", async () => {
    (vscode.window.showSaveDialog as jest.Mock).mockResolvedValue(vscode.Uri.file("test.uml"));
    (vscode.workspace.fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    const result = await storage.saveToFile(mockDiagram, "uml");

    expect(result).toBe(true);
    expect(vscode.window.showSaveDialog).toHaveBeenCalled();
    expect(vscode.workspace.fs.writeFile).toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      "Diagrama UML salvo com sucesso!"
    );
  });

  it("salva um projeto .umlproj corretamente", async () => {
    (vscode.window.showSaveDialog as jest.Mock).mockResolvedValue(vscode.Uri.file("test.umlproj"));
    (vscode.workspace.fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    const result = await storage.saveToFile({ name: "Projeto", diagrams: [mockDiagram] }, "umlproj");

    expect(result).toBe(true);
    expect(vscode.workspace.fs.writeFile).toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      "Projeto UML salvo com sucesso!"
    );
  });

  it("retorna false se usuário cancelar o salvamento", async () => {
    (vscode.window.showSaveDialog as jest.Mock).mockResolvedValue(undefined);
    const result = await storage.saveToFile(mockDiagram);
    expect(result).toBe(false);
  });

  it("retorna false e exibe erro se falhar ao salvar", async () => {
    (vscode.window.showSaveDialog as jest.Mock).mockRejectedValue(new Error("Falha"));
    const result = await storage.saveToFile(mockDiagram);
    expect(result).toBe(false);
    expect(vscode.window.showErrorMessage).toHaveBeenCalled();
  });

  // =====================================================
  // CARREGAR ARQUIVOS
  // =====================================================

  it("carrega um diagrama .uml e migra corretamente", async () => {
    const fakeFile = {
      metadata: mockDiagram.metadata,
      elements: [],
      relationships: [],
    };
    (vscode.window.showOpenDialog as jest.Mock).mockResolvedValue([vscode.Uri.file("test.uml")]);
    (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from(JSON.stringify(fakeFile)));

    const result = await storage.loadFromFile("uml");

    expect(result).toHaveProperty("metadata.name", "Diagrama Teste");
    expect(vscode.window.showOpenDialog).toHaveBeenCalled();
  });

  it("carrega um projeto .umlproj corretamente", async () => {
    const fakeProject = {
      version: "1.0",
      name: "Projeto UML",
      diagrams: [mockDiagram],
    };
    (vscode.window.showOpenDialog as jest.Mock).mockResolvedValue([vscode.Uri.file("test.umlproj")]);
    (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from(JSON.stringify(fakeProject)));

    const result = await storage.loadFromFile("umlproj");
    expect(result?.diagrams?.length).toBe(1);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      "Projeto UML carregado com sucesso!"
    );
  });

  it("retorna null se formato do projeto for inválido", async () => {
    (vscode.window.showOpenDialog as jest.Mock).mockResolvedValue([vscode.Uri.file("invalid.umlproj")]);
    (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(Buffer.from("{}"));

    const result = await storage.loadFromFile("umlproj");
    expect(result).toBeNull();
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Formato de projeto inválido.");
  });

  it("retorna null se o usuário cancelar o carregamento", async () => {
    (vscode.window.showOpenDialog as jest.Mock).mockResolvedValue(undefined);
    const result = await storage.loadFromFile("uml");
    expect(result).toBeNull();
  });

  // =====================================================
  // WORKSPACE STATE
  // =====================================================

  it("salva e carrega diagrama do workspace corretamente", async () => {
    await storage.saveToWorkspace(mockDiagram);
    expect(mockContext.workspaceState.update).toHaveBeenCalled();

    // Simula recuperação válida
    const recentTimestamp = Date.now();
    mockContext.workspaceState.get.mockReturnValue({
      diagram: mockDiagram,
      timestamp: recentTimestamp,
    });

    const result = await storage.loadFromWorkspace();
    expect(result).toEqual(mockDiagram);
  });

  it("retorna null se o diagrama no workspace for antigo", async () => {
    mockContext.workspaceState.get.mockReturnValue({
      diagram: mockDiagram,
      timestamp: Date.now() - 25 * 60 * 60 * 1000, // mais de 24h
    });

    const result = await storage.loadFromWorkspace();
    expect(result).toBeNull();
  });

  // =====================================================
  // TEMPLATES
  // =====================================================

  it("salva e carrega template corretamente", async () => {
    mockContext.globalState.get.mockReturnValue({});
    await storage.saveAsTemplate(mockDiagram, "MeuTemplate");
    expect(mockContext.globalState.update).toHaveBeenCalledWith("templates", {
      MeuTemplate: mockDiagram,
    });

    mockContext.globalState.get.mockReturnValue({ MeuTemplate: mockDiagram });
    const loaded = await storage.loadTemplate("MeuTemplate");
    expect(loaded).toEqual(mockDiagram);
  });

  it("retorna null se template não existir", async () => {
    mockContext.globalState.get.mockReturnValue({});
    const result = await storage.loadTemplate("Inexistente");
    expect(result).toBeNull();
  });

  it("lista templates corretamente", async () => {
    mockContext.globalState.get.mockReturnValue({
      T1: mockDiagram,
      T2: mockDiagram,
    });

    const result = await storage.listTemplates();
    expect(result).toEqual(["T1", "T2"]);
  });

  // =====================================================
  // PRIVADOS (via indireta)
  // =====================================================

  it("método privado migrateDiagram retorna metadados e comentários", () => {
    const anyStorage: any = storage;
    const migrated = anyStorage.migrateDiagram({
      metadata: mockDiagram.metadata,
      elements: [],
      relationships: [],
      comments: "teste",
    });
    expect(migrated.metadata.name).toBe("Diagrama Teste");
  });

  it("método privado isRecent retorna corretamente", () => {
    const anyStorage: any = storage;
    expect(anyStorage.isRecent(Date.now())).toBe(true);
    expect(anyStorage.isRecent(Date.now() - 25 * 60 * 60 * 1000)).toBe(false);
  });
});
