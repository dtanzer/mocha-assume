"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.assuming = assuming;
exports.assume = assume;
function assuming(assumption) {
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    var itFunction = function itFunction(str, fn) {
        return it.skip(str + " - SKIPPED" + message, fn);
    };
    if (typeof assumption === "function") {
        var result = assume(assumption)();
        if (result == null) {
            itFunction = it;
        } else {
            if (message === "") {
                message = " (" + result + ")";
            } else {
                message = " (" + message + ")";
            }
        }
    } else {
        if (assumption === true) {
            itFunction = it;
        } else if (message !== "") {
            message = " (" + message + ")";
        }
    }
    return {
        it: itFunction
    };
}

function assume(assertion) {
    return function () {
        try {
            assertion();
        } catch (e) {
            return e.message;
        }
        return null;
    };
}