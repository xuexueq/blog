function createScript(url) {
    let script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('type', 'text/javascript');
    script.async = true; // 或者直接插入文档底部 document.body.appendChild(script);
    return script;
}
// NumberObject.toString(radix) radix数字转化的基数：2~36之间的整数，36表示36进制，能将26个字母全部运用上
// /[^a-z]+/g :[^a-z]表示除a~z之间的字符 +：{1,}表示出现的所有字符
// 字符串的方法slice和substring都表示切割从起始位置到结束位置(不包括)之间的字符 substr()第一个参数表示切割的起始位置 第二个参数表示切割的长度
function gernerateCbName(prefix, num) {
    return prefix + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, num);
}

// 我们将所有的callback都设置成了一个全局变量，这样的原因是因为我们需要在数据请求完成之后调用这个方法，因此不得不设置为一个全局变量。
// 但是当我们有多个请求，并且每个请求的处理都是不一样的时候，这个变量将会被覆盖。这是不行的，因此我们应该为每一次请求设置一个唯一且不会冲突的变量
// 页面中若有大量这样的请求之后，window中会含有大量的全局变量，而且还有大量的script标签，这显然不是我们想要的，所以我们要在请求完成之后删除变量和script标签。
function jsonp({ url, params, timerout = 0}) {
    let timer = null;
    let cbName = gernerateCbName('cb');
    let arr = [];
    params = { ...params, cbName }
    for(let key in params) {
        arr.push(`${key}=${params[key]}`)
    }

    let script = createScript(`${url}?${arr.join('&')}`);
    document.getElementsByTagName('head')[0].appendChild(script);

    // 错误处理（例如资源加载失败）
    script.onerror = function() {
        reject(new Error(`fetch ${url} failed`));
        window[cbName] = null;
        timer && clearTimeout(timer);
        document.getElementsByTagName('head')[0].removeChild(script);
    }

    return new Promise((resolve, reject) => {
        window[cbName] = function(data) {
            resolve(data);
            window[cbName] = null;
            timer && clearTimeout(timer);
            document.getElementsByTagName('head')[0].removeChild(script);
        }

        // 超时处理
        if(timerout != 0) {
            timer = setTimeout(() => {
                reject(new Error('TimeOut'));
                timer && clearTimeout(timer);
                // window[cbName] = null;
                // document.getElementsByTagName('head')[0].removeChild(script);
            }, timerout);
        }
    });
}

// 使用
jsonp({
    url: 'http://localhost:3000',
    params: {
        name: 'xql'
    },
    timerout: 1
}).then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});