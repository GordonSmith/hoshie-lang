import * as vscode from "vscode";
import * as path from "path";
import { scopedLogger } from "@hpcc-js/util";
import { HLFileScope } from "../hlcc/cst/scopes/file";
import { HLDiagnosticCollection } from "./diagnostic";

const logger = scopedLogger("hoverProvider.ts");

export let hoverProvider: HLHoverProvider;
export class HLHoverProvider implements vscode.HoverProvider {
    protected _ctx: vscode.ExtensionContext;

    protected _diagnostic: HLDiagnosticCollection;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.languages.registerHoverProvider("hoshie", this));
        this._diagnostic = HLDiagnosticCollection.attach(ctx);
    }

    static attach(ctx: vscode.ExtensionContext): HLHoverProvider {
        if (!hoverProvider) {
            hoverProvider = new HLHoverProvider(ctx);
        }
        return hoverProvider;
    }

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        return new Promise((resolve, reject) => {
            const id = document.getText(document.getWordRangeAtPosition(position));

            const hlFile = new HLFileScope("", document.fileName, document.getText());
            this._diagnostic.set(document.fileName, hlFile.allErrors());

            const scope = hlFile.resolveScope(position.line + 1, position.character);

            const decl = scope.resolve(id);

            const marked = new vscode.MarkdownString(decl ? `\
__${decl.expression.type}__:  _${decl.eval()}_

${path.relative(path.dirname(document.fileName), decl.scope.path)} (${decl.line}, ${decl.column}, ${decl.length})
            ` : "");

            resolve(new vscode.Hover(marked));
        });
    }
}
