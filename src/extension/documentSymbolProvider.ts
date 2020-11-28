import { scopedLogger } from "@hpcc-js/util";
import * as vscode from "vscode";
import { HLFile } from "../hlcc/file";
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
            const hlFile = new HLFile("", document.fileName, document.getText());
            this._diagnostic.set(hlFile.allErrors());

            const retVal: vscode.DocumentSymbol[] = [];

            function addSymbol(name: string | undefined, detail: string, kind: vscode.SymbolKind, range?: vscode.Range, selectionRange?: vscode.Range | undefined) {
                if (name) {
                    retVal.push(new vscode.DocumentSymbol(name, detail, kind, range, selectionRange ?? range));
                }
            }

            hlFile.imports.forEach(i => addSymbol(i.file.label, i.file.path, vscode.SymbolKind.File, new vscode.Range(i.line - 1, i.column, i.line - 1, i.column + i.length)));

            // if (parsed) {
            // parsed.ast.statements.filter(s => s.content).forEach(s => {
            //     switch (s.content?.type) {
            //         case "assignment":
            //             const assign = s.content as assignment;
            //             addSymbol(assign.lhs?.id?.image, "assignment - " + (assign.errors.length ? "partial" : "full"), vscode.SymbolKind.Variable, s.range, assign.lhs?.range);
            //             break;
            //         case "declaration":
            //             const decl = s.content as declaration;
            //             addSymbol(decl.id?.image, "declaration - " + (decl.errors.length ? "partial" : "full"), vscode.SymbolKind.Variable, s.range, decl.id?.range);
            //             break;
            //     }
            // });
            // }

            resolve(retVal);
        });
    }
}
