import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { AdditiveExpression, ArrayExpression, ArrowBody, ArrowParamater, DataExpression, FunctionCallExpression, IdentifierExpression, NumericExpression, RelationalExpression, StringExpression } from "../cst/expression";
import { CountFunction, FilterFunction, FirstNFunction, GenerateFunction, PipelineFunction, RandomFunction, ReadJsonFunction, SortFunction } from "../cst/function";
import { HLScope, resolveRef } from "../cst/scope";
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
const fs = require("fs");

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
        const ref = resolveRef(row);
        if (text !== undefined) {
            if (row?.func instanceof PipelineFunction) {
                this.append(`console.log(JSON.stringify([...${text}], undefined, 2));`, row.scope.path);
            } else if (ref?.isSensor) {
                this.append(`console.log(${text}.peek());`, row.scope.path);
            } else {
                this.append(`console.log(${text});`, row.scope.path);
            }
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
        row.args.forEach(arg => this.generate(arg));
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
${row.items?.map(item => this.generate(item)).join(";\n")}${row.items?.length ? ";\n" : ""}\
${row.returnExpression ? "return" : ""} ${this.generate(row.returnExpression)};`;
    }

    GenerateFunction(row: GenerateFunction) {
        return `df.generate(${this.generate(row.expression)}, ${this.generate(row.total)})`;
    }

    RandomFunction(row: RandomFunction) {
        return "TODO"; //`Math(${this.generate(row.expression)}, ${this.generate(row.total)})`;
    }

    PipelineFunction(row: PipelineFunction) {
        return `df.pipe(${row.items.map(item => {
            const retVal = this.generate(item);
            const ref = resolveRef(item);
            if (ref?.isSensor) {
                return `df.sensor(${retVal})`;
            }
            return retVal;
        }).join(", ")})`;
    }

    FilterFunction(row: FilterFunction) {
        return `df.filter(${this.generate(row.expression)})`;
    }

    FirstNFunction(row: FirstNFunction) {
        return `df.first(${row.count})`;
    }

    SortFunction(row: SortFunction) {
        return `df.sort(${this.generate(row.expression)})`;
    }

    MapFunction(row: SortFunction) {
        return `df.map(${this.generate(row.expression)})`;
    }

    CountFunction(row: CountFunction) {
        return "df.count()";
    }

    MeanFunction(row: CountFunction) {
        return `df.mean(${this.generate(row.expression)})`;
    }

    QuartileFunction(row: CountFunction) {
        return `df.quartile(${this.generate(row.expression)})`;
    }

    ExtentFunction(row: CountFunction) {
        return `df.extent(${this.generate(row.expression)})`;
    }

    DistributionFunction(row: CountFunction) {
        return `df.distribution(${this.generate(row.expression)})`;
    }

    DeviationFunction(row: CountFunction) {
        return `df.deviation(${this.generate(row.expression)})`;
    }

    VariationFunction(row: CountFunction) {
        return `df.variation(${this.generate(row.expression)})`;
    }

    ReadJsonFunction(row: ReadJsonFunction) {
        return `JSON.parse(fs.readFileSync(${this.generate(row.expression)}, 'utf8'))`;
    }
}

export function generate(hlFile: HLFileScope) {
    const jsWriter = new JSWriter();
    hlFile.allActions().forEach(row => {
        jsWriter.writeAction(row);
    });
    console.log(jsWriter.output());
}
