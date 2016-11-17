# Assumptions for mocha.js

mocha-assume lets you skip tests when your assumptions about the test do not hold. You can use it to decouple your tests - to get rid of those situations where 10 tests fail because of the same failure.

## How? Very Short Version

    npm install --save-dev mocha-assume

Then, in your tests, use assuming to document your assumptions about tests:
    import { assuming } from 'mocha-assume';

    assuming(true).it("This test will run", () => { /* ... */ });
    assuming(false).it("This test will NOT run", () => { /* ... */ });

## Why? Very Short Version

Sometimes, you have tests that look as if they are totally independent, but in reality, they are not: When one of them fails, all others fail too. The reason is that the first test tests a precondition for all other tests.

Here's an example:

    import {expect} from 'chai';

    function createRequest() {
        return null;
    }

    describe("request (without assumptions)", () => {
        it("returns a non-null request", () => {
            const request = createRequest();
            expect(request).to.not.be.null;
        });

        it("invokes done when request completes without error", () => {
            let doneInvoked = false;
            const request = createRequest();
            request.done(() => doneInvoked=true);
            
            request.start();
            
            expect(doneInvoked).to.be.true;
        });
    });

The output, when running those tests, is:
    request (without assumptions)
        1) returns a non-null request
            AssertionError: expected null not to be null
        2) invokes done when request completes without error
            TypeError: Cannot read property 'done' of null

In this case, both tests fail, because the returned request is null. But only the first test fails in a **meaningful** way: It tells you, what exactly went wront. The second test only fails **coincidentally**.

You really want to get rid of this situation.

## How? The long version...

Import "assuming" from mocha-assume:

    import {assuming} from 'mocha-assume';

... and use it to skip tests when your assumptions about preconditions of the test do not hold. You can also pass in a message as a second parameter to document why the test was skipped. And you can use a chai assertion instead of the first parameter to make everything even more readable.

    assuming(false)
        .it("test with simple boolean, no message", () => expect(false).to.be.true );
    assuming(false, "because the planets are not yet aligned")
        .it("test with simple boolean, with message", () => expect(false).to.be.true );
    assuming(() => "foo".should.equal("bar"))
        .it("test with chai assertion, no message", () => expect(false).to.be.true);
    assuming(() => "foo".should.equal("bar"), "because foos are not bars")
        .it("test with chai assertion, no message", () => expect(false).to.be.true);

Those four skipped tests will result in the following output from mocha:

    - test with simple boolean, no message - SKIPPED
    - test with simple boolean, with message - SKIPPED (because the planets are not yet aligned)
    - test with chai assertion, no message - SKIPPED (expected 'foo' to equal 'bar')
    - test with chai assertion, no message - SKIPPED (because foos are not bars)

## Why? The long version...

Now you can skip tests when your assumption about the precondition for the test does not hold. From our example above, we can easily remove the redundant test-failure:

    import {expect, should} from 'chai';
    import {assuming} from 'mocha-assume';

    should();

    function createRequest() {
        return null;
    }

    describe("request (with assumptions)", () => {
        it("returns a non-null request", () => {
            const request = createRequest();
            expect(request).to.not.be.null;
        });

        describe("a valid request invokes all callbacks", () => {
            let request = null;
            
            beforeEach(() => request = createRequest());

            assuming(() => request.should.not.be.null).it("invokes done when request completes without error", () => {
                let doneInvoked = false;
                const request = createRequest();
                request.done(() => doneInvoked=true);
                
                request.start();
                
                expect(doneInvoked).to.be.true;
            });
        });
    });

Now the output is:

    request (with assumptions)
        4) returns a non-null request
            AssertionError: expected null not to be null
        a valid request invokes all callbacks
        - invokes done when request completes without error - SKIPPED (Cannot read property 'should' of null)

So now you can start de-coupling your tests.

## Need support?

If you have any questions, feel free to contact me on Twitter or via email:
* David Tanzer | business@davidtanzer.net | <a href="https://twitter.com/dtanzer">@dtanzer</a>

If you are interested in learning more about test driven development, clean code, and writing good tests, check out this course: http://www.davidtanzer.net/cc (subscribe to the mailing list if you are interested, but would like to have the course in a different location).

## LICENSE

    MIT License

    Copyright (c) 2016 David Tanzer

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
