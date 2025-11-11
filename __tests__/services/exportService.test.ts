import { ExportService } from "../../src/services/exportService";

// Mock para html2canvas
jest.mock("html2canvas", () =>
  jest.fn(async () => ({
    toDataURL: () => "data:image/png;base64,ABC",
    width: 800,
    height: 600,
  }))
);

// Mock para jsPDF
const mockAddImage = jest.fn();
const mockSave = jest.fn();
const mockAddPage = jest.fn();
const mockText = jest.fn();
const mockSetFontSize = jest.fn();
const mockSplitTextToSize = jest.fn(() => ["linha 1", "linha 2"]);

jest.mock("jspdf", () => ({
  jsPDF: jest.fn(() => ({
    addImage: mockAddImage,
    save: mockSave,
    addPage: mockAddPage,
    text: mockText,
    setFontSize: mockSetFontSize,
    splitTextToSize: mockSplitTextToSize,
    internal: { pageSize: { getWidth: () => 210, getHeight: () => 297 } },
  })),
}));

// Mock global para URL.createObjectURL e revokeObjectURL
if (typeof URL.createObjectURL === "undefined") {
  // @ts-ignore
  global.URL.createObjectURL = jest.fn(() => "blob:mocked-url");
}

if (typeof URL.revokeObjectURL === "undefined") {
  // @ts-ignore
  global.URL.revokeObjectURL = jest.fn();
}

describe("ExportService", () => {
  // ✅ Mock global document caso não exista (Node)
  if (typeof document === "undefined") {
    // @ts-ignore
    global.document = {
      createElement: jest.fn(() => {
        const a = { click: jest.fn() };
        return a;
      }),
      body: { appendChild: jest.fn() },
    } as unknown as Document;
  }

  const element = (document.createElement("div") as unknown) as HTMLElement;

  it("exporta para PNG sem erros", async () => {
    await ExportService.exportToPNG(element);
    expect(true).toBe(true); // apenas valida execução sem erro
  });

  it("exporta para PDF com comentários", async () => {
    await ExportService.exportToPDF(element, "test.pdf", "Teste de comentários");
    expect(mockAddImage).toHaveBeenCalled();
    expect(mockAddPage).toHaveBeenCalled();
  });

  it("exporta para SVG corretamente", async () => {
    // ✅ Mock mais tipado do createElement
    const linkClick = jest
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string): any => {
        if (tagName === "a") {
          return {
            click: jest.fn(),
            set href(_: string) {},
            set download(_: string) {},
          };
        }
        return document.createElement(tagName);
      });

    await ExportService.exportToSVG(element);
    expect(linkClick).toHaveBeenCalledWith("a");
    linkClick.mockRestore();
  });
});
