import * as vscode from "vscode";
import { scopedLogger } from "@hpcc-js/util";
import { HLFileScope } from "../hlcc/cst/scopes/file";
import { HLDiagnosticCollection } from "./diagnostic";

const logger = scopedLogger("documentSymbolProvider.ts");

export let documentSymbolProvider: HLDocumentSymbolProvider;
export class HLDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    protected _ctx: vscode.ExtensionContext;

    protected _diagnostic: HLDiagnosticCollection;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.languages.registerDocumentSymbolProvider("hoshie", this));
        this._diagnostic = HLDiagnosticCollection.attach(ctx);
    }

    static attach(ctx: vscode.ExtensionContext): HLDocumentSymbolProvider {
        if (!documentSymbolProvider) {
            documentSymbolProvider = new HLDocumentSymbolProvider(ctx);
        }
        return documentSymbolProvider;
    }

    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        return new Promise((resolve, reject) => {
            const hlFile = new HLFileScope("", document.fileName, document.getText());
            this._diagnostic.set(document.fileName, hlFile.allErrors());

            const retVal: vscode.DocumentSymbol[] = [];

            function addSymbol(name: string | undefined, detail: string, kind: vscode.SymbolKind, range?: vscode.Range, selectionRange?: vscode.Range | undefined) {
                if (name) {
                    retVal.push(new vscode.DocumentSymbol(name, detail, kind, range, selectionRange ?? range));
                }
            }

            hlFile.importedFiles.forEach(i => addSymbol(i.file.label, i.file.path, vscode.SymbolKind.File, new vscode.Range(i.line - 1, i.column, i.line - 1, i.column + i.length)));
            for (const declKey in hlFile.declarations) {
                const decl = hlFile.declarations[declKey];
                addSymbol(declKey, decl.scope.path, vscode.SymbolKind.Variable, new vscode.Range(decl.line - 1, decl.column, decl.line - 1, decl.column + decl.length));
            }

            resolve(retVal);
        });
    }
}
