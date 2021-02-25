import { AdditiveExpression, ArrayExpression, DataExpression, FunctionCallExpression, IdentifierExpression, NumericExpression, StringExpression } from "../cst/expression";
import { GenerateFunction } from "../cst/function";
import { HLFileScope } from "../cst/scopes/file";
import { HLFunctionScope } from "../cst/scopes/function";
import { RowType } from "../cst/types";

class JSWriter {
    decl: { [id: string]: string } = {};
    buffer: string[] = [];

    append(line: string) {
        this.buffer.push(line);
    }

    outputDecl() {
        const retVal: string[] = [];
        for (const key in this.decl) {
            retVal.push(`const ${key} = ${this.decl[key]};`);
        }
        return retVal.join("\n");
    }

    outputBuffer() {
        return this.buffer.join("\n");
    }

    output() {
        return `\
import * as df from "@hpcc-js/dataflow";

${this.outputDecl()}

${this.outputBuffer()}
`;
    }

    generate(row: any) {
        if (typeof row === "string") {
            debugger;
            return row;
        } else if (this[row?.constructor?.name]) {
            return this[row.constructor.name](row);
        }
        return `todo("${row?.constructor?.name}")`;
    }

    writeAction(row: any) {
        const text = this.generate(row);
        if (text !== undefined) {
            this.append(`console.log(${text});`);
            return true;
        }
        console.log(`Unhandled type:  ${row?.constructor?.name}`);
        return false;
    }

    writeDecl(id: string, ref: any) {
        if (!this.decl[id]) {
            this.decl[id] = this.generate(ref);
        }
    }

    IdentifierExpression(row: IdentifierExpression) {
        this.writeDecl(row.id, row.ref);
        return `${row.id}`;
    }

    BooleanExpression(row: NumericExpression) {
        return `${row.value}`;
    }

    NumericExpression(row: NumericExpression) {
        return `${row.value}`;
    }

    StringExpression(row: StringExpression) {
        return `"${row.value}"`;
    }

    DataExpression(row: DataExpression) {
        const fields = row.fields.map((exp, i) => {
            const id = row.rowType?.fields[i]?.id || i;
            return `${id}: ${this.generate(exp)}`;
        });
        return `{ ${fields.join(", ")} }`;
    }

    ArrayExpression(row: ArrayExpression) {
        const fields = row.values.map((exp, i) => {
            if (exp instanceof DataExpression && row.rowType?.rowType) {
                exp.typeInfo(row.rowType?.rowType as RowType);
            }
            return `${this.generate(exp)}`;
        });
        return `[ ${fields.join(", ")} ]`;
    }

    AdditiveExpression(row: AdditiveExpression) {
        return `${this.generate(row.lhs)} ${row.action} ${this.generate(row.rhs)}`;
    }

    FunctionCallExpression(row: FunctionCallExpression) {
        this.writeDecl(row.id, row.func);
        return `${row.ctx.getText()}`;
    }

    HLFunctionScopeXXX(row: HLFunctionScope) {

    }

    GenerateFunction(row: GenerateFunction) {
        return `df.generate(${this.generate(row.expression)}, ${this.generate(row.total)})`;
    }
}

export function generate(hlFile: HLFileScope) {
    const jsWriter = new JSWriter();
    hlFile.allActions().forEach(row => {
        jsWriter.writeAction(row);
    });
    console.log(jsWriter.output());
}
