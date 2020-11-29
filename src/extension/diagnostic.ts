import * as vscode from "vscode";
import { HLError } from "../hlcc/ast/node";

let eclDiagnosticCollection: vscode.DiagnosticCollection;

export let diagnostic: HLDiagnosticCollection;
export class HLDiagnosticCollection {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        eclDiagnosticCollection = vscode.languages.createDiagnosticCollection("hoshie");
        ctx.subscriptions.push(eclDiagnosticCollection);
    }

    static attach(ctx: vscode.ExtensionContext): HLDiagnosticCollection {
        if (!diagnostic) {
            diagnostic = new HLDiagnosticCollection(ctx);
        }
        return diagnostic;
    }

    async set(filePath: string, errors: HLError[]) {
        const fileErrors = {};
        fileErrors[filePath] = [];

        for (const e of errors) {
            if (!fileErrors[e.filePath]) {
                fileErrors[e.filePath] = [];
            }
            const uri = vscode.Uri.file(e.filePath);
            const document = await vscode.workspace.openTextDocument(uri);
            const pos = new vscode.Position(e.line - 1, e.column);
            let charPos = e.column + e.length;
            if (charPos < 0) {
                charPos = 0;
            }
            const toPos = new vscode.Position(e.line - 1, charPos);
            const range = new vscode.Range(pos, toPos);//document.getWordRangeAtPosition(pos) ?? new vscode.Range(pos, pos);
            fileErrors[e.filePath].push(new vscode.Diagnostic(range, e.message, vscode.DiagnosticSeverity.Error));
        }

        for (const key in fileErrors) {
            const uri = vscode.Uri.file(key);
            eclDiagnosticCollection.set(uri, fileErrors[key]);
        }
    }
}
