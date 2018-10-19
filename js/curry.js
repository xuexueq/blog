let curry = function(fn, args = []) {
    let length = fn.length;
    return function () {
        let newArgs = args.concat(...arguments);
        if(newArgs.length < length) {
            return curry(fn, newArgs); // return
        } else {
            return fn.apply(null, newArgs); // return
        }
    }
}



let add1 = function() {
    let args = [...arguments];
    let _add = function () {
        args = args.concat(...arguments);
        return add1.apply(null, args); // 要执行 调用自身 并把之前的参数带上
    }
    _add.toString = function () {
        return args.reduce(function (a, b) {
            return a + b;
        } );
    }
    return _add;
}

let add2 = function () {
    let args = [...arguments];

    let adder = function () {

        let _add = function () {
            args = args.concat(...arguments); // 这里的变量可以重新定义 也可以使用 args 只是不能当做局部调用 否则下次会保存
            return _add;
        }

        _add.toString = function () {
            return args.reduce(function (a, b) { // return
                return a + b;
            });
        }

        return _add;
    }

    return adder.apply(null, args); // 要执行
}