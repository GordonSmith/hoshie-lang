import * as vscode from "vscode";
import { HLFile } from "../hlcc/file";
import { HLDiagnosticCollection } from "./diagnostic";
import { activeHoshieDocument } from "./util";

export let commands: Commands;
export class Commands {

    _ctx: vscode.ExtensionContext;
    protected _diagnostic: HLDiagnosticCollection;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        this._diagnostic = HLDiagnosticCollection.attach(ctx);
        ctx.subscriptions.push(vscode.commands.registerCommand("ho.checkSyntax", () => this.checkSyntax()));
    }

    static attach(ctx: vscode.ExtensionContext): Commands {
        if (!commands) {
            commands = new Commands(ctx);
        }
        return commands;
    }

    checkSyntax() {
        const document = activeHoshieDocument();
        if (document) {
            const hlFile = new HLFile(document.getText(), document.fileName, document.getText());
            this._diagnostic.set(hlFile.allErrors());
        }
    }
}
