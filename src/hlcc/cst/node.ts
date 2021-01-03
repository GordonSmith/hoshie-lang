import { ErrorListenerError } from "../errorListener";
import { Range } from "./scope";

export type ExpresionT = boolean | number | string | boolean[] | number[] | string[] | ((...args: any[]) => any);
export type ExpresionType = "unknown" | "boolean" | "number" | "string" | "boolean[]" | "number[]" | "string[]" | "data" | "data[]" | "function";
export function isArray(type: ExpresionType) {
    switch (type) {
        case "boolean[]":
        case "number[]":
        case "string[]":
            return true;
    }
    return false;
}

export function removeQuotes(str: string) {
    return str.substring(1, str.length - 1);
}

export interface HLError extends ErrorListenerError {
    filePath: string;
}

export const hlError = (filePath: string, e: ErrorListenerError): HLError => ({ filePath, ...e });

export class HLNode implements Range {

    get line(): number {
        return this.ctx.start.line;
    }

    get column(): number {
        return this.ctx.start.column;
    }

    get length(): number {
        let retVal = this.ctx.start.stop - this.ctx.start.start + 1;
        if (retVal < 0) {
            retVal = 0;
        }
        return retVal;
    }

    constructor(protected ctx: any) {
    }

    createError(source: string, message: string): ErrorListenerError {
        return {
            source,
            line: this.line,
            column: this.column,
            length: this.length + 1,
            message
        };
    }
}

