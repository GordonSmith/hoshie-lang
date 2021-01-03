import * as vscode from "vscode";
import { HLFileScope } from "../hlcc/cst/scopes/file";
import { HLDiagnosticCollection } from "./diagnostic";
import { activeHoshieDocument } from "./util";

export let commands: HLCommands;
export class HLCommands {

    _ctx: vscode.ExtensionContext;
    protected _diagnostic: HLDiagnosticCollection;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        this._diagnostic = HLDiagnosticCollection.attach(ctx);
        ctx.subscriptions.push(vscode.commands.registerCommand("ho.checkSyntax", () => this.checkSyntax()));
    }

    static attach(ctx: vscode.ExtensionContext): HLCommands {
        if (!commands) {
            commands = new HLCommands(ctx);
        }
        return commands;
    }

    checkSyntax() {
        const document = activeHoshieDocument();
        if (document) {
            const hlFile = new HLFileScope(document.getText(), document.fileName, document.getText());
            this._diagnostic.set(document.fileName, hlFile.allErrors());
        }
    }
}
