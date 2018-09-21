function myPromise(fn) {
    this.value = null;
    this.status = 'pending';
    this.resolveFun = function(){}; // 成功回调的方法就得变成数组才能存储 最好写成 this.resolveFun = []
    this.rejectedFun = function(){};
    fn(this.resolve.bind(this));
}
myPromise.prototype.resolve = function(val) {
    //let _this = this;
    if(this.status == 'pending') {
        this.status = 'fullfilled';
        this.value = val;
        setTimeout(() => {
            this.resolveFun(this.value);
        }, 0);
    }
};
// .then() 每次返回一个新的 Promise 对象
myPromise.prototype.then = function(fullfilled) {
    //let _this = this;
    return new myPromise((resolve, reject) => {
        this.resolveFun = () => {
            let res = fullfilled(this.value);
            if(res && typeof res.then == 'function') {
                res.then(resolve, reject);
            } else {
                resolve(res);
            }
        }
    });
};

/**
*******************************************************
*/

class myPromise {
    constructor(fn) {
        this.value = null;
        this.status = 'pending';
        this.resolveFunc = function(){}; // 异步操作成功后的回调
        this.rejectedFunc = function(){};
        fn(this.resolve.bind(this), this.reject.bind(this)); // fn() 中执行异步操作
    }
    /*
        调用 then() 注册回调函数， 类似观察者模式
    */
    then(onFulfilled, onRejected) {
        // this.resolveFunc = onFulfilled;
        // this.rejectedFunc = onRejected;
        return new myPromise((resolve, reject) => {
            // if(this.status === 'pending') { // 不能加这个判断 无论什么时候都会执行 下面的 this.resolveFunc 不起作用
            //     this.resolveFunc = onFulfilled;
            //     this.rejectedFunc = onRejected;
            //     return;
            // }
            // 如果 then() 中没有传递任何参数
            if(!onFulfilled && !onRejected) {
                resolve(this.value); // 要把value resolve 出去，因为可能后续还有.then()操作，不能断链，能继续形成链式调用
            }
            this.resolveFunc = () => { // 改变外部 Promise 的回调
                let res = onFulfilled(this.value); // 执行传进 .then() 的参数，判断是否返回一个Promise对象
                if(res && typeof res.then === 'function') {
                    res.then(resolve, reject); // ???
                } else {
                    resolve(res);
                }
            };
            this.rejectedFunc = () => {
                let res = onRejected(this.value);
                if(res && typeof res.then === 'function') {
                    res.then(resolve, reject);
                } else {
                    reject(res);
                }
                
            }
        });
    }
    /*
        val 代表一步操作返回的结果
        当异步操作执行成功后，使用 resolve() ，开始一一执行 resolveFunc 中的回调
        并通过 setTimeout 机制，保证在执行 resolve 之前，then 方法已经完成回调函数的注册
    */
    resolve(val) {
        if(this.status === 'pending') {
            this.status = 'fullfilled';
            this.value = val;
            setTimeout(() => {
                this.resolveFunc(this.value);
            }, 0);
        }
    }
    reject(val) {
        if(this.status === 'pending') {
            this.status = 'rejected';
            this.value = val;
            setTimeout(() => {
                this.rejectedFunc(this.value);
            }, 0);
        }
    }
}