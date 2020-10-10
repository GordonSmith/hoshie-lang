#!/usr/bin/env node

const yargs = require("yargs");
import * as fs from "fs"
import { parse } from "./hlcc/parser";

const argv = yargs
    .scriptName("hlcc")
    .usage("Usage:  $0 [options] <./path/someFile.ho>")
    .option("s", { alias: "syntax", describe: "Check Syntax", type: "boolean", demandOption: false })
    .argv
    ;

const inFiles: string[] = argv._ || [];

if (argv.syntax) {
    console.log(`Checking Syntax:  ${argv._}`);
    fs.readFile(inFiles[0], 'utf8', (err, data) => {
        if (err) {
            console.error(err.message);
        } else {
        }
    });
} else {
    console.log(`Compiling:  ${argv._}`);
    fs.readFile(inFiles[0], 'utf8', (err, data) => {
        if (err) {
            console.error(err.message);
        } else {
        }
    });
}
