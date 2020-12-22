// @ts-ignore
import { ErrorListener } from "antlr4/error";
import { HLLexer } from "./grammar/HLLexer";

export interface ErrorListenerError {
    source: string;
    line: number;
    column: number;
    length: number;
    severity?: string;
    code?: number;
    message: string;
}

export class HLErrorListener extends ErrorListener {

    errors: ErrorListenerError[] = [];

    constructor(readonly logging = false) {
        super();
    }

    syntaxError(recognizer, offendingSymbol, line, column, msg, err) {
        this.errors.push({
            source: "ErrorListener",
            line,
            length: offendingSymbol.stop - offendingSymbol.start,
            column,
            message: msg
        });
        if (this.logging) {
            const type = recognizer instanceof HLLexer ? "Lexer" : "Parser";
            console.error(type + ":  " + "line " + line + ":" + column + " " + msg);
        }
    }

    log() {
        this.errors.forEach(e => console.log(`${e.source}:  ${e.message}`));
    }
}
