import { expect } from "chai";
import { HLFileScope } from "../hlcc/cst/scopes/file";
import { parse } from "../hlcc/parser";

describe("hlcc/parser", () => {
    it.only("basic", async () => {
        const hlFile = new HLFileScope("basic", "./samples/test-basic-001.ho");
        const errors = hlFile.allErrors();
        expect(errors.length).to.equal(0);
    });

    it.skip("errors", async () => {
        const parsed = await parse("./samples/error-001.ho");
        expect(parsed.parseErrors.length).to.be.greaterThan(0);
    });
});
