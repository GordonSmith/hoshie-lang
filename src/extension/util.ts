import * as vscode from "vscode";

export const hasActiveDocument = (): boolean => !!vscode.window.activeTextEditor?.document;
export const isActiveDocumentHoshie = (): boolean => hasActiveDocument() && vscode.languages.match({ language: "hoshie", scheme: "file" }, vscode.window.activeTextEditor?.document) > 0;
export const activeHoshieDocument = () => isActiveDocumentHoshie() ? vscode.window.activeTextEditor?.document : undefined;
