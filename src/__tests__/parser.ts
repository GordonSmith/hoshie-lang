import { expect } from "chai";
import { HLFileScope } from "../hlcc/cst/scopes/file";

import fs from "fs";
const path = "./tutorial/";

const filesArray = fs.readdirSync(path).filter(file => fs.lstatSync(path + file).isFile());

describe("hlcc/parser", () => {
    describe("tutorial", () => {
        filesArray.forEach(file => {
            it.only(file, async () => {
                const hlFile = new HLFileScope("basic", `./tutorial/${file}`);
                const errors = hlFile.allErrors();
                switch (file) {
                    case "expresions.ho":
                        expect(errors.length).to.equal(3);
                        break;
                    default:
                        expect(errors.length).to.equal(0);
                        if (errors.length) {
                            console.log(errors);
                        }
                }
            });
        });
    });
});
