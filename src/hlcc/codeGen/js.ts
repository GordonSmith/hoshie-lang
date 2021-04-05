import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { AdditiveExpression, ArrayExpression, ArrowBody, ArrowParamater, DataExpression, FunctionCallExpression, IdentifierExpression, NumericExpression, PipeExpression, RelationalExpression, StringExpression } from "../cst/expression";
import { CountFunction, FilterFunction, FirstNFunction, GenerateFunction, RandomFunction, SortFunction } from "../cst/function";
import { HLScope } from "../cst/scope";
import { HLFileScope } from "../cst/scopes/file";
import { HLFunctionScope } from "../cst/scopes/function";
import { RowType } from "../cst/types";

type Declaration = { [id: string]: string };
type FileContent = { [path: string]: { declarations: Declaration, actions: string[] } };

class JSWriter {
    fileContent: FileContent = {};

    append(line: string, path: string) {
        if (!this.fileContent[path]) {
            this.fileContent[path] = { declarations: {}, actions: [] };
        }
        this.fileContent[path].actions.push(line);
    }

    outputDecl(path: string) {
        const retVal: string[] = [];
        for (const decl in this.fileContent[path].declarations) {
            retVal.push(`const ${decl} = ${this.fileContent[path].declarations[decl]};`);
            }
        return retVal.join("\n");
    }

    outputBuffer(path: string) {
        return this.fileContent[path].actions.join("\n");
    }

    output() {
        const retVal: string[] = [];
        for (const hoPath in this.fileContent) {
            const outPath = hoPath.split(".");
            outPath.pop();
            outPath.push("js");
            const jsPath = path.join("out-js", outPath.join("."));
            retVal.push(`// ${jsPath}`);
            const content = `\
/* eslint-disable */
const df = require("@hpcc-js/dataflow");

${this.outputDecl(hoPath)}

${this.outputBuffer(hoPath)}
`;
            fs.mkdirSync(path.dirname(jsPath), { recursive: true });
            fs.writeFileSync(jsPath, content);
            retVal.push(content);
        }
        return retVal.join("\n");
    }

    generate(row: any) {
        if (typeof row === "string") {
            debugger;
            return row;
        } else if (typeof row === "undefined") {
            return "//  generate(undefined)";
        } else if (this[row?.constructor?.name]) {
            return this[row.constructor.name](row);
        }
        return `todo("${row?.constructor?.name}")`;
    }

    writeAction(row: any) {
        const text = this.generate(row);
        if (text !== undefined) {
            this.append(`console.log(${text});`, row.scope.path);
            return true;
        }
        console.log(`Unhandled type:  ${row?.constructor?.name}`);
        return false;
    }

    writeDecl(id: string, ref: any, scope: HLScope) {
        if (scope instanceof HLFunctionScope) {
            debugger;
        }
        if (!this.fileContent[scope.path]) {
            this.fileContent[scope.path] = { declarations: {}, actions: [] };
        }
        if (!this.fileContent[scope.path].declarations[id]) {
            this.fileContent[scope.path].declarations[id] = this.generate(ref);
        }
    }

    IdentifierExpression(row: IdentifierExpression) {
        if (row.scope instanceof HLFileScope) {
            this.writeDecl(row.id, row.ref, row.scope);
        }
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

    RelationalExpression(row: RelationalExpression) {
        return `${this.generate(row.lhs)} ${row.action} ${this.generate(row.rhs)}`;
    }

    FunctionCallExpression(row: FunctionCallExpression) {
        this.writeDecl(row.id, row.func, row.scope);
        return `${row.id}(${row.args.map(arg => {
            return arg?.ctx.getText() || "undefined";
        }).join(", ")})`;
    }

    HLFunctionScope(row: HLFunctionScope) {

        const defaults = [];
        row.params.forEach(param => {
            if (param.defaultExpression()) {
                defaults.push(`${param.id} = ${param.id} !== undefined ? ${param.id} : ${this.generate(param.defaultExpression())};`);
            }
        });

        return `(${row.params.map(param => param.id).join(", ")}) => {
${defaults.join("\n")}${defaults.length ? "\n" : ""}\
${this.generate(row.body)}
}`;
    }

    ArrowParamaterXXX(row: ArrowParamater) {
    }

    ArrowBody(row: ArrowBody) {
        return `\
${row.items.map(item => this.generate(item)).join(";\n")}${row.items.length ? ";\n" : ""}\
${row.returnExpression ? "return" : ""} ${this.generate(row.returnExpression)};`;
    }

    GenerateFunction(row: GenerateFunction) {
        return `df.generate(${this.generate(row.expression)}, ${this.generate(row.total)})`;
    }

    RandomFunction(row: RandomFunction) {
        return "TODO"; //`Math(${this.generate(row.expression)}, ${this.generate(row.total)})`;
    }

    PipeExpression(row: PipeExpression) {
        return `df.pipe(${row.items.map(item => this.generate(item)).join(", ")})`;
    }

    FilterFunction(row: FilterFunction) {
        return `df.filter(${this.generate(row.expression)})`;
    }

    SortFunction(row: SortFunction) {
        return `df.sort(${this.generate(row.expression)})`;
    }

    MapFunction(row: SortFunction) {
        return `df.map(${this.generate(row.expression)})`;
    }

    CountFunction(row: CountFunction) {
        return "df.sensor(df.count())";
    }

    FirstNFunction(row: FirstNFunction) {
        return `df.sensor(df.first(${row.count}))`;
    }
}

export function generate(hlFile: HLFileScope) {
    const jsWriter = new JSWriter();
    hlFile.allActions().forEach(row => {
        jsWriter.writeAction(row);
    });
    console.log(jsWriter.output());
}
