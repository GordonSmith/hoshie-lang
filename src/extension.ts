import * as vscode from "vscode";
import { activate as hoshieMainActivate } from "./extension/main";

export function activate(context: vscode.ExtensionContext) {
    hoshieMainActivate(context);
}

// this method is called when your extension is deactivated
export function deactivate() { }
