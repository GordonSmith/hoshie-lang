import * as fs from "fs";
import * as path from "path";
import { parse, ParseResponse } from "./parser";
import { HLVisitor } from "./grammar/HLVisitor";
import { ErrorListenerError } from "./errorListener";

const posix = (windowsPath) => windowsPath.replace(/^\\\\\?\\/, "").replace(/\\/g, "\/").replace(/\/\/+/g, "\/");

function decodeStringLiteral(str: string) {
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

export class HLFile extends HLVisitor {

    protected _parsed: ParseResponse;

    readonly imports: ImportedHLFile[] = [];

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
        return this._parsed.parseErrors.map(e => hlError(this.path, e));
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
        const [from, impStr] = ctx.children;
        const str = decodeStringLiteral(impStr.symbol.text);
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
}
