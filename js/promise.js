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
    fullfilled = typeof fullfilled === 'function' ? fullfilled : (value) => {return value}; // 实现Promise值的穿透
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
        fullfilled = typeof fullfilled === 'function' ? fullfilled : (value) => {return value};
        onRejected = typeof onRejected === 'function' ? onRejected : (value) => {throw value};
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

/**
*****************************************************
*/

(function() {
    let STOP_VALUE = {}; // //只要外界无法“===”这个对象就可以了
    // let STOP_VALUE = Symbol()//构造一个Symbol以表达特殊的语义
    let STOP_PROMISE = Promise.resolve(STOP_VALUE); // //不是每次返回一个新的Promise，可以节省内存。即所有的终止 Promise 而返回的永远处于pedding状态的Promise对象都是共用这一个 Promise，不需要每次终止 Promise 都去返回一个新的永远处于pedding状态的Promise对象

    Promise.stop = function () {
        return STOP_PROMISE;
    }
    Promise.prototype._then = Promise.prototype.then;
    Promise.prototype.then = function(resolveFun, rejectedFun) {
        return this._then((value) => {
            return value === STOP_VALUE ? value : resolveFun(value);
        }, rejectedFun); // return
    };
})()

Promise.resolve(8).then(v => {
  console.log(v)
  return 9
}).then(v => {
  console.log(v)
  return Promise.stop()//较为明确的语义
}).catch(function(){// will never called but will be GCed
  console.log('catch')
}).then(function(){// will never called but will be GCed
  console.log('then')
})