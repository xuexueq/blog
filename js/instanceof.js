function myInstanceof(leftValue, rightValue) {
    rightValue = rightValue.prototype; // 取右表达式的 prototype 值
    leftValue = leftValue.__proto__; // 取左表达式的__proto__值
    while(true) {
        if(leftValue === null) return false;
        if(leftValue === rightValue) return true;
        leftValue = leftValue.__proto__;
    }
}

// function Foo() {
// }

// Object instanceof Object // true
// Function instanceof Function // true
// Function instanceof Object // true
// Foo instanceof Foo // false
// Foo instanceof Object // true
// Foo instanceof Function // true