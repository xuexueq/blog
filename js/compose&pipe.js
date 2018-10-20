function compose() {
    let args = arguments;
    let start = args.length - 1;
    let result;
    return function() {
        result = args[start].apply(this, arguments);
        while(start--) {
            result = args[start].call(this, result);
        }
        return result;
    }
}

function pipe() {
    let args = arguments;
    let start = 0;
    let length = args.length;
    let result;
    return function () {
        result = args[start].apply(this, arguments);
        while(start--) {
            result = args[start].call(this, result);
        }
        return result;
    }
}