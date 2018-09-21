class Stack {
    constructor() {
        this.top = null; // 栈顶指针
        this.size = 0;
    }
    push(val) {
        this.top = {
            data: val,
            next: this.top // 栈顶元素的下一位元素
        };
        this.size++;
    }
    pop() {
        if(this.top === null) return null;
        let out = this.top;
        this.top = this.top.next;
        if(this.size > 0) this.size--;
        return out.data;
    }
    peek() {
        return this.top ===null ? null : this.top.data;
    }
    clear() {
        this.top = null;
        this.size = 0;
    }
    displayAll() {
        if(this.size === null) return null;
        let arr = [];
        let current = this.top;
        for(let len = this.size - 1, i = len; i >= 0; i--) {
            arr[i] = current.data;
            current = current.next;
        }
        return arr;
    }
}
let stack = new Stack();
stack.push(11);
stack.push(22);
stack.push(33);
stack.push(44);
stack.pop(); // 44
stack.displayAll(); //  [11, 22, 33]
console.log(stack);

/**
*******************************************************
*/

class Queue {
    constructor() {
        this.font = null;
        this.end = null;
        this.size = 0;
    }
    // 入队
    enqueue(val) {
        let node = {
            data: val,
            next: null
        }
        if(!this.size) {
            this.font = node;
            this.end = node;
            this.size++;
            return; // return;
        }
        this.end.next = node; // 未入队时队尾的元素的下一个指针应指向新入队的元素
        this.end = node; // 新入队的元素变成队尾
        this.size++;
    }
    // 出队
    dequeue() {
        if(!this.size) {
            console.log('Queue is empty!');
            return; // return 'Queue is empty!';
        }       
        let out = this.font.data;
        this.font = this.font.next;
        if(this.size === 1) this.end.data = null; // ===比较操作符 =赋值操作符 这里如果不写会造成当所有元素都出队时队尾还有值 像下图的情况
        if(this.size > 0) this.size--;
        return out;
    }
    // print
    print() {
        if(!this.size) {
            return false;
        }
        let arr = [];
        let current = this.font;
        // while(this.size) {
        //     arr.push(current.data);
        //     current = current.next;
        //     this.size--; // 这种方式会改变原队列 使最后队列为空
        // }
        for(let i = 0, len = this.size; i < len; i++) {
            arr.push(current.data);
            current = current.next;
        }
        return arr;
    }
}

let q = new Queue();
q.enqueue(11);
q.enqueue(22);
q.enqueue(33);
q.print(); // [11, 22, 33]
console.log(q);