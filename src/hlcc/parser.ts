import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import * as antlr4 from "antlr4";
import { HLError, ErrorListener } from "./errorListener";
import { HLLexer } from "./grammar/HLLexer";
import { HLParser } from "./grammar/HLParser";
import { ImportVisitor } from "./visitor";

const readFilePromise = util.promisify(fs.readFile);

export const isBoolean = (str: string) => str === "boolean";
export const isString = (str: string) => str === "string";
export const isNumber = (str: string) => str === "number";

interface ParseResponse {
    filePath?: string;
    full: boolean;
    errors: HLError[];
    exception?: Error;
}

export async function parse(filePath: string, text?: string): Promise<ParseResponse> {
    if (!text) {
        text = await readFilePromise(filePath, { encoding: "utf8" });
    }

    const chars = new antlr4.InputStream(text);
    const lexer = new HLLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser: any = new HLParser(tokens);
    parser.buildParseTrees = true;
    const visitor = new ImportVisitor(filePath);

    const errorListener = new ErrorListener(filePath);
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    try {
        const tree = parser.program();
        errorListener.log();
        visitor.visitProgram(tree);
        return {
            full: true,
            errors: errorListener.errors
        };
    } catch (e) {
        console.log(e);
        return {
            full: false,
            errors: errorListener.errors,
            exception: e
        };
    }
}
