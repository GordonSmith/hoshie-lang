import * as fs from "fs";
import * as path from "path";
import { parse, ParseResponse } from "../../parser";
import { hlError, HLError, removeQuotes } from "../node";
import { Alias, HLDeclaration } from "../declaration";
import { HLScope, Range } from "../scope";
import { HLFunctionScope } from "./function";
import { HLAction, Test } from "../action";

const posix = (windowsPath) => windowsPath.replace(/^\\\\\?\\/, "").replace(/\\/g, "\/").replace(/\/\/+/g, "\/");

export interface ImportedHLFile extends Range {
    file: HLFileScope;
}

export class HLFileScope extends HLScope {

    protected _parsed: ParseResponse;

    readonly importedFiles: ImportedHLFile[] = [];
    readonly exports: { [id: string]: HLDeclaration } = {};

    constructor(readonly label: string, readonly path: string, readonly text?: string) {
        super(label, path, text);
        if (!text) {
            text = fs.readFileSync(path, { encoding: "utf8" });
        }

        this._parsed = parse(text);
        if (this._parsed.full) {
            // try {
            this.visitProgram(this._parsed.tree);
            // } catch (e) {
            //     if (!this._parsed.lexErrors.length && !this._parsed.parseErrors.length) {
            //         //  Unexpected visitor error...
            //         console.error(e);
            //     }
            // }
        }
    }

    resolveScope(line: number, column: number) {
        for (const key in this.declarations) {
            const decl = this.declarations[key];
            if (decl.expression instanceof HLFunctionScope && decl.expression.contains(line, column)) {
                return decl.expression;
            }
        }
        return this;
    }

    errors(): HLError[] {
        return [
            ...this._parsed.lexErrors.map(e => hlError(this.path, e)),
            ...this._parsed.parseErrors.map(e => hlError(this.path, e)),
            ...super.errors()
        ];
    }

    allErrors(): HLError[] {
        let retVal = this.errors();
        this.importedFiles.forEach(i => {
            retVal = retVal.concat(i.file.allErrors());
        });
        return retVal;
    }

    allActions(): HLAction[] {
        let retVal = this.actions();
        this.importedFiles.forEach(i => {
            retVal = retVal.concat(i.file.allActions());
        });
        return retVal;
    }

    allTests(): Test[] {
        let retVal = this.tests();
        this.importedFiles.forEach(i => {
            retVal = retVal.concat(i.file.allTests());
        });
        return retVal;
    }

    //  Visitor overrides  ---

    visitImportStatement(ctx) {
        const [, importForm] = super.visitImportStatement(ctx);
        const [decls, file]: [{ identifier: string, as: string, ctx }[], HLFileScope] = importForm;
        decls.shift();
        decls.pop();
        decls?.forEach(row => {
            const decl = file.exports[row.identifier];
            if (decl) {
                if (row.as) {
                    this.appendDeclaration(row.ctx, row.as, new Alias(row.ctx, this, row.as, decl));
                } else {
                    this.appendDeclaration(row.ctx, row.identifier, decl);
                }
            } else {
                this.ctxError(row.ctx, `${row.identifier} not exported from ${file.path}`);
            }
        });
        return importForm;
    }

    visitModuleItems(ctx) {
        const retVal = super.visitModuleItems(ctx);
        return retVal.filter(row => !!row);
    }

    visitImportDeclaration(ctx): { identifier: string, as: string, ctx } {
        const [id, , idAs] = ctx.children;

        const identifier = id.identifier().getText();
        const as = idAs?.identifier().getText();

        return { identifier, as, ctx };
    }

    visitImportFrom(ctx) {
        const [] = super.visitImportFrom(ctx);
        const [, impStr] = ctx.children;
        const str = removeQuotes(impStr.getText());
        const importFilePath = posix(path.join(path.dirname(this.path), str + ".ho"));
        if (!fs.existsSync(importFilePath)) {
            this.tokError(impStr, "Invalid file path");
        } else {
            //  TODO - Create Pool so File doesn't get parsed multiple times.
            const importHLFile = new HLFileScope(str, importFilePath);
            this.importedFiles.push({
                line: impStr.symbol.line,
                column: impStr.symbol.column,
                length: impStr.symbol.stop - impStr.symbol.start + 1,
                file: importHLFile
            });
            return importHLFile;
        }
        return undefined;
    }

    visitExportDeclaration(ctx) {
        const retVal = super.visitExportDeclaration(ctx);
        const [, hlVar] = retVal;
        this.exports[hlVar.id] = hlVar;
        return retVal;
    }

    visitArrowFunctionExpression(ctx) {
        const f = new HLFunctionScope(this.path, ctx, this);
        return f;
    }
}