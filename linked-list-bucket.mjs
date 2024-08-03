class Node {
  constructor(value, next = null) {
    this.content = value;
    this.next = next;
  }
}

export default class LinkedListBucket {
  constructor() {
    this.size = 0;
    this.head = null;
    this.tail = null;
  }
  append(value) {
    const node = new Node(value);
    if (!this.tail) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
  }
  at(index) {
    let currentNode = this.head;
    for (let i = 0; i < index; i++) {
      currentNode = currentNode.next;
    }
    return currentNode;
  }
  findKey(key) {
    let currentNode = this.head;
    for (let i = 0; i < this.size; i++) {
      if (currentNode.content.indexOf(key) === 0) return i;
      currentNode = currentNode.next;
    }
    return null;
  }
  insertAt(value, index) {
    let currentNode = this.head;
    let nextNode = currentNode.next;
    for (let i = 0; i < index - 1; i++) {
      currentNode = nextNode;
      nextNode = nextNode.next;
    }
    currentNode.next = new Node(value, nextNode);
    this.size++;
  }
  removeAt(index) {
    let currentNode = this.head;
    let nextNode = currentNode.next;
    for (let i = 0; i < index - 1; i++) {
      currentNode = nextNode;
      nextNode = nextNode.next;
    }
    currentNode.next = nextNode.next;
    this.size--;
  }
}
