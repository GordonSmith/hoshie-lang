#!/usr/bin/env node

import * as yargs from "yargs";
import { HLFileScope } from "./hlcc/ast/fileScope";

const argv = yargs
    .scriptName("hlcc")
    .command("check <file>", "Syntax check file")
    .command("run <file>", "Execute file")
    .command("test <file>", "Unit test file")
    .help()
    .argv
    // .option("s", { alias: "syntax", describe: "Check Syntax", type: "boolean", demandOption: false })
    ;
// yargs.showHelp();
const [cmd] = argv._ || [];
let hlFile;

switch (cmd) {
    case "check":
        console.log(`Syntax checking "${argv.file}"\n`);
        hlFile = new HLFileScope("", argv.file);
        hlFile.allErrors().forEach(row => {
            console.log(`${row.source}:${row.line}:${row.column} - ${row.severity} HO${row.code}: ${row.message}`);
        });

        break;
    case "run":
        console.log(`Running "${argv.file}"\n`);
        hlFile = new HLFileScope("", argv.file);
        hlFile.allActions().forEach(row => {
            console.log(row.eval());
        });
        break;
    case "test":
        console.log(`Testing "${argv.file}"\n`);
        hlFile = new HLFileScope("", argv.file);
        const results = hlFile.allTests().map(row => row.test());
        console.log(results.join(""));
        break;
    default:
        yargs.showHelp();
        console.error(`\nInvalid command "${cmd}", expected "check | run | rest"`);
}
//     default:
// }
/*

if (argv.syntax) {
    console.log(`Checking Syntax:  ${argv._}`);
    fs.readFile(inFiles[0], "utf8", (err, data) => {
        if (err) {
            console.error(err.message);
        } else {
        }
    });
} else {
    console.log(`Compiling:  ${argv._}`);
    fs.readFile(inFiles[0], "utf8", (err, data) => {
        if (err) {
            console.error(err.message);
        } else {
        }
    });
}

*/