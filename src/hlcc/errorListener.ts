import { error } from "antlr4";

export interface HLError {
    source: string;
    filePath: string;
    line: number;
    column: number;
    message: string;
}

export class ErrorListener extends error.ErrorListener {

    errors: HLError[] = [];

    constructor(private _filePath: string) {
        super();
    }

    syntaxError(recognizer, offendingSymbol, line, column, msg, err) {
        this.errors.push({
            source: "ErrorListener",
            filePath: this._filePath,
            line,
            column,
            message: msg
        });
    }

    log() {
        this.errors.forEach(e => console.log(`${e.source}:  ${e.message}`));
    }

}
