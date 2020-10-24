import * as vscode from "vscode";
import { Commands } from "./command";
import { HLDiagnosticCollection } from "./diagnostic";
import { HLDocumentSymbolProvider } from "./documentSymbolProvider";

export function hlActivate(ctx: vscode.ExtensionContext): void {
    Commands.attach(ctx);
    HLDiagnosticCollection.attach(ctx);
    HLDocumentSymbolProvider.attach(ctx);
}

export function hlDeactivate(): void {
}
