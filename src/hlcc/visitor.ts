import * as path from "path";
import { HLVisitor } from "./grammar/HLVisitor";

function decodeStringLiteral(str: string) {
    return str.substring(1, str.length - 2);
}

export class ImportVisitor extends HLVisitor {

    imports: string[] = [];

    constructor(private _filePath: string) {
        super();
    }

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
        const importFilePath = path.join(path.dirname(this._filePath), decodeStringLiteral(ctx.stop.text)) + ".ho";
        this.imports.push(importFilePath);
        return super.visitImportFrom(ctx);
    }
}
