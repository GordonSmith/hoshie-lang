import * as antlr4 from "antlr4";
import { ErrorListenerError, HLErrorListener } from "./errorListener";
import { HLLexer } from "./grammar/HLLexer";
import { HLParser } from "./grammar/HLParser";

export const isBoolean = (str: string) => str === "boolean";
export const isString = (str: string) => str === "string";
export const isNumber = (str: string) => str === "number";

export interface ParseResponse {
    filePath?: string;
    full: boolean;
    tree?: any;
    lexErrors: ErrorListenerError[];
    parseErrors: ErrorListenerError[];
    exception?: ErrorListenerError;
}

export function parse(text: string): ParseResponse {
    const chars = new antlr4.InputStream(text);

    const lexer = new HLLexer(chars) as unknown as antlr4.Lexer;
    lexer.removeErrorListeners();
    const lexerErrorListener = new HLErrorListener();
    lexer.addErrorListener(lexerErrorListener);

    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new HLParser(tokens) as unknown as antlr4.Parser;
    parser.removeErrorListeners();
    const parserErrorListener = new HLErrorListener();
    parser.addErrorListener(parserErrorListener);

    parser.buildParseTrees = true;

    // try {
    const tree = (parser as any).program();
    return {
        full: true,
        tree,
        lexErrors: lexerErrorListener.errors,
        parseErrors: parserErrorListener.errors
    };
    // } catch (e) {
    //     console.log(e);
    //     return {
    //         full: false,
    //         lexErrors: lexerErrorListener.errors,
    //         parseErrors: parserErrorListener.errors,
    //         exception: e
    //     };
    // }
}
