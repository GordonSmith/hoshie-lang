import { error } from "antlr4";
import { HLLexer } from "./grammar/HLLexer";

export interface ErrorListenerError {
    source: string;
    line: number;
    column: number;
    message: string;
}

export class ErrorListener extends error.ErrorListener {

    errors: ErrorListenerError[] = [];

    constructor(readonly logging = true) {
        super();
    }

    syntaxError(recognizer, offendingSymbol, line, column, msg, err) {
        this.errors.push({
            source: "ErrorListener",
            line,
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
