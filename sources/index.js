export function assuming(assumption, message = "") {
    let itFunction = (str, fn) => it.skip(str + " - SKIPPED"+message, fn);
    if (typeof assumption === "function") {
        const result = assume(assumption)();
        if(result == null) {
            itFunction = it;
        } else {
            if(message === "") {
                message = " ("+result+")";
            } else {
                message = " ("+message+")";
            }
        }
    } else {
        if(assumption === true) {
            itFunction = it;
        } else if(message !== "") {
            message = " ("+message+")";
        }
    }
    return {
        it: itFunction
    };
}

export function assume(assertion) {
    return () => {
        try {
            assertion();
        } catch(e) {
            return e.message;
        }
        return null;
    };
}
