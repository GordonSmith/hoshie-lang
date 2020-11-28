import * as fs from "fs";
import * as path from "path";
import { parse, ParseResponse } from "./parser";
import { HLParserVisitor } from "./grammar/HLParserVisitor";
import { ErrorListenerError } from "./errorListener";

const posix = (windowsPath) => windowsPath.replace(/^\\\\\?\\/, "").replace(/\\/g, "\/").replace(/\/\/+/g, "\/");

function removeQuotes(str: string) {
    return str.substring(1, str.length - 1);
}

export interface HLError extends ErrorListenerError {
    filePath: string;
}

const hlError = (filePath: string, e: ErrorListenerError): HLError => ({ filePath, ...e });

export interface Range {
    line: number,
    column: number,
    length: number
}

export interface ImportedHLFile extends Range {
    file: HLFile;
}

export class HLVariable {

    constructor(readonly file: HLFile, readonly id: string, protected _rhs) {
    }

    check(): HLError | undefined {
        return undefined;
    }
}

export class HLFile extends HLParserVisitor {

    protected _parsed: ParseResponse;
    private _errors: HLError[] = [];

    readonly imports: ImportedHLFile[] = [];
    readonly exports: { [id: string]: HLVariable } = {};
    readonly variables: { [id: string]: HLVariable } = {};

    constructor(readonly label: string, readonly path: string, readonly text?: string) {
        super();
        if (!text) {
            text = fs.readFileSync(path, { encoding: "utf8" });
        }

        this._parsed = parse(text);
        if (this._parsed.full) {
            this.visitProgram(this._parsed.tree);
        }
    }

    errors(): HLError[] {
        return [...this._parsed.parseErrors.map(e => hlError(this.path, e)), ...this._errors];
    }

    allErrors(): HLError[] {
        let retVal = this.errors();
        this.imports.forEach(i => {
            retVal = retVal.concat(i.file.allErrors());
        });
        return retVal;
    }

    //  Visitor overrides  ---

    visitProgram(ctx) {
        return super.visitProgram(ctx);
    }

    visitBlock(ctx) {
        return super.visitBlock(ctx);
    }

    visitImportStatement(ctx) {
        return super.visitImportStatement(ctx);
    }

    visitImportFrom(ctx) {
        const [From, impStr] = ctx.children;
        const str = removeQuotes(impStr.symbol.text);
        const importFilePath = posix(path.join(path.dirname(this.path), str + ".ho"));
        const importHLFile = new HLFile(str, importFilePath);
        this.imports.push({
            line: impStr.symbol.line,
            column: impStr.symbol.column,
            length: impStr.symbol.stop - impStr.symbol.start,
            file: importHLFile
        });
        return super.visitImportFrom(ctx);
    }

    visitAdditiveExpression(ctx) {
        const retVal = super.visitAdditiveExpression(ctx);
        return retVal;
    }

    visitIdentifierExpression(ctx) {
        const retVal = super.visitIdentifierExpression(ctx);
        return retVal;
    }

    visitLiteralExpression(ctx) {
        const retVal = super.visitLiteralExpression(ctx);
        return retVal;
    }

    visitArrayLiteralExpression(ctx) {
        const retVal = super.visitArrayLiteralExpression(ctx);
        return retVal;
    }

    visitInitialiser(ctx) {
        const retVal = super.visitInitialiser(ctx);
        return retVal;
    }

    visitVariableDeclaration(ctx) {
        const retVal = super.visitVariableDeclaration(ctx);
        const [id, rhs] = ctx.children;
        const hlVar = new HLVariable(this, id.symbol.text, rhs);
        this.variables[hlVar.id] = hlVar;
        const error = hlVar.check();
        if (error) {
            this._errors.push(error);
        }
        return hlVar;
    }

    visitVariableStatement(ctx) {
        const [hlVar, eos] = super.visitVariableStatement(ctx);
        return hlVar;
    }

    visitExportDeclaration(ctx) {
        const retVal = super.visitExportDeclaration(ctx);
        const [Export, hlVar] = retVal;
        this.exports[hlVar.id] = hlVar;
        return retVal;
    }
}
