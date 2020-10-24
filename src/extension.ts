import * as vscode from "vscode";
import { hlActivate, hlDeactivate } from "./extension/main";

export function activate(context: vscode.ExtensionContext) {
    hlActivate(context);
}

export function deactivate() {
    hlDeactivate();
}
