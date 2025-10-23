import * as vscode from "vscode";
import * as path from "path";
import { DiagramStorage } from "./persistence/diagramStorage";

let diagramStorage: DiagramStorage;
let activePanel: vscode.WebviewPanel | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
  diagramStorage = new DiagramStorage(context);

  const disposable = vscode.commands.registerCommand("umlDraw.start", async () => {
    if (activePanel) {
      activePanel.reveal(vscode.ViewColumn.One);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "umlDraw",
      "UMLDraw — Editor UML",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, "dist")),
          vscode.Uri.file(path.join(context.extensionPath, "src", "webview")),
        ],
      }
    );

    activePanel = panel;

    const bundleUri = panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, "dist", "bundle.js"))
    );
    const cssUri = panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, "src", "webview", "styles.css"))
    );

    const nonce = getNonce();
    panel.webview.html = getHtml(panel, bundleUri, cssUri, nonce);

    setupMessageHandlers(panel);

    panel.onDidDispose(() => {
      activePanel = undefined;
    }, null, context.subscriptions);
  });

  context.subscriptions.push(disposable);
}

function setupMessageHandlers(panel: vscode.WebviewPanel) {
  panel.webview.onDidReceiveMessage(async (message) => {
    switch (message.command) {
      /** 🔹 Diagramas individuais (.uml) */
      case "saveToFile":
        await diagramStorage.saveToFile(message.diagram, "uml");
        break;

      case "saveAsFile":
        await diagramStorage.saveToFile(message.diagram, "uml");
        break;

      case "requestLoad":
        const loadedDiagram = await diagramStorage.loadFromFile("uml");
        if (loadedDiagram) {
          panel.webview.postMessage({ command: "loadDiagram", diagram: loadedDiagram });
        }
        break;

      /** 🔹 Projetos múltiplos (.umlproj) */
      case "saveProject":
        await diagramStorage.saveToFile(message.project, "umlproj");
        break;

      case "saveAsProject":
        await diagramStorage.saveToFile(message.project, "umlproj");
        break;

      case "requestLoadProject":
        const loadedProject = await diagramStorage.loadFromFile("umlproj");
        if (loadedProject) {
          panel.webview.postMessage({ command: "loadProject", project: loadedProject });
        }
        break;

      /** 🔹 Sessão inicial */
      case "requestInitialDiagram":
        const savedDiagram = await diagramStorage.loadFromWorkspace();
        panel.webview.postMessage({
          command: "loadInitialDiagram",
          diagram: savedDiagram,
        });
        break;

      /** 🔹 Mensagens VSCode */
      case "showError":
        vscode.window.showErrorMessage(message.text);
        break;

      case "showInfo":
        vscode.window.showInformationMessage(message.text);
        break;
    }
  });
}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function getHtml(panel: vscode.WebviewPanel, bundleUri: vscode.Uri, cssUri: vscode.Uri, nonce: string) {
  const csp = `default-src 'none'; style-src ${panel.webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${panel.webview.cspSource} data:;`;
  return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy" content="${csp}">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>UMLDraw</title>
      <link href="${cssUri}" rel="stylesheet">
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${bundleUri}"></script>
    </body>
    </html>
  `;
}
