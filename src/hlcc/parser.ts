import { Antlr4Error, ErrorListener } from "./errorListener";

import * as antlr4 from "antlr4";
import { HLLexer } from "./grammar/HLLexer";
import { HLParser } from "./grammar/HLParser";
import { Visitor } from "./visitor";

interface Parsed {
    errors: Antlr4Error[];
}

export const isBoolean = (str: string) => str === "boolean";
export const isString = (str: string) => str === "string";
export const isNumber = (str: string) => str === "number";
export function parse(text: string) {
    const chars = new antlr4.InputStream(text);
    const lexer = new HLLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser: any = new HLParser(tokens);
    parser.buildParseTrees = true;
    const visitor = new Visitor();

    const errorListener = new ErrorListener();
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    try {
        const tree = parser.program();
        errorListener.log();
        visitor.visitProgram(tree);
    } catch (e) {
        console.log(e);
    }
}
