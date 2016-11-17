import { expect, should } from 'chai';

import { assuming, assume } from '../sources/index';

global.originalIt = it;
global.it = (str, fn) => fn();
global.it.skip = (str, fn) => str;

should();

describe("assume", () => {
    originalIt("Returns a function that evaluates to null when the expression does not throw an exception", () => {
        let fn = assume(_ => true.should.be.true);
        expect(fn()).to.equal(null);
    });

    originalIt("Returns a function that evaluates to a string message when the expression does throw an exception", () => {
        let fn = assume(_ => true.should.be.false);
        expect(fn()).to.be.a('string');
    });
});

describe("assuming", () => {
    describe("Running / Skipping tests", () => {
        originalIt("Runs test normally when assumption is true", () => {
            let testHasRun = false;
            assuming(true).it("should run the test", () => { testHasRun = true; });
            expect(testHasRun).to.be.true;
        });

        originalIt("Does not run the test when assumption is false", () => {
            let testHasRun = false;
            assuming(false).it("should run the test", () => { testHasRun = true; });
            expect(testHasRun).to.be.false;
        });

        originalIt("Runs test normally when assumption is a function that evaluates to null", () => {
            let testHasRun = false;
            assuming(_ => true.should.be.true).it("should run the test", () => { testHasRun = true; });
            expect(testHasRun).to.be.true;
        });

        originalIt("Does not run test normally when assumption is a function that evaluates to a string", () => {
            let testHasRun = false;
            assuming(_ => true.should.be.false).it("should run the test", () => { testHasRun = true; });
            expect(testHasRun).to.be.false;
        });
    });

    describe("Skip message", () => {
        originalIt("Skips test with correct message when assumption (function) does not hold and no message is given", () => {
            let testHasRun = false;
            const skipMessage = assuming(_ => true.should.be.false).it("should run the test", () => { testHasRun = true; });
            expect(skipMessage).to.equal("should run the test - SKIPPED (expected true to be false)");
        });

        originalIt("Skips test with correct message when assumption (function) does not hold and message is given", () => {
            let testHasRun = false;
            const skipMessage = assuming(_ => true.should.be.false, "some message").it("should run the test", () => { testHasRun = true; });
            expect(skipMessage).to.equal("should run the test - SKIPPED (some message)");
        });

        originalIt("Skips test with correct message when assumption does not hold and message is given", () => {
            let testHasRun = false;
            const skipMessage = assuming(false, "some message").it("should run the test", () => { testHasRun = true; });
            expect(skipMessage).to.equal("should run the test - SKIPPED (some message)");
        });

        originalIt("Skips test without message when assumption does not hold and no message is given", () => {
            let testHasRun = false;
            const skipMessage = assuming(false).it("should run the test", () => { testHasRun = true; });
            expect(skipMessage).to.equal("should run the test - SKIPPED");
        });
    });
});
