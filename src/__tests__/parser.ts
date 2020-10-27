import { expect } from "chai";
import { parse } from "../hlcc/parser";

describe("hlcc/parser", () => {
    it.only("basic", async () => {
        const parsed = await parse("./samples/test-001.ho");
        expect(parsed.parseErrors.length).to.equal(0);
    });

    it("errors", async () => {
        const parsed = await parse("./samples/error-001.ho");
        expect(parsed.parseErrors.length).to.be.greaterThan(0);
    });
});
