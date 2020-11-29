import * as vscode from "vscode";
import { HLCommands } from "./commands";
import { HLDiagnosticCollection } from "./diagnostic";
import { HLHoverProvider } from "./hoverProvider";
import { HLDocumentSymbolProvider } from "./documentSymbolProvider";

export function hlActivate(ctx: vscode.ExtensionContext): void {
    HLCommands.attach(ctx);
    HLDiagnosticCollection.attach(ctx);
    HLHoverProvider.attach(ctx);
    HLDocumentSymbolProvider.attach(ctx);
}

export function hlDeactivate(): void {
}
