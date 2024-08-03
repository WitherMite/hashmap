import LinkedListBucket from "./linked-list-bucket.mjs";

// enforce a size limit on the buckets array for the exercise
// assume string keys
export default class HashMap {
  static #createBuckets(arr, size) {
    for (let i = 0; i < size; i++) {
      arr.push(new LinkedListBucket());
    }
  }
  static #visitAll(buckets, callback) {
    const all = [];
    buckets.forEach((bucket) => {
      if (bucket.size === 0) return;
      let node = bucket.head;
      while (node !== null) {
        all.push(callback(node));
        node = node.next;
      }
    });
    return all;
  }

  #buckets = [];
  #defaultSize;
  #entryCount = 0;
  constructor(load = 0.75, size = 16) {
    this.loadFactor = load;
    this.#defaultSize = size;
    HashMap.#createBuckets(this.#buckets, size);
  }

  #hash(key) {
    // hash function provided by odin project
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
      hashCode = hashCode % this.#buckets.length;
    }
    return hashCode;
  }
  #getBucket(key) {
    const index = this.#hash(key);
    if (index < 0 || index >= this.#buckets.length) {
      throw new Error("Trying to access index out of bound", { cause: index });
    } else return this.#buckets[index];
  }
  #changeSize(size) {
    const newBuckets = [];
    HashMap.#createBuckets(newBuckets, size);

    const prevBuckets = this.#buckets;
    this.#buckets = newBuckets;
    this.#entryCount = 0;

    HashMap.#visitAll(prevBuckets, (entry) => {
      this.set(...entry.content);
    });
  }
  #handleNewEntry() {
    const overCapacity =
      ++this.#entryCount / this.#buckets.length > this.loadFactor;
    if (overCapacity) {
      console.log("over capacity");
      this.#changeSize(this.#buckets.length * 2);
    }
  }
  #handleRemoveEntry() {
    --this.#entryCount;
    const halfLength = this.#buckets.length / 2;
    if (halfLength < this.#defaultSize) return;

    const underPrevCapacity = this.#entryCount / halfLength <= this.loadFactor;
    if (underPrevCapacity) {
      console.log("under capacity");
      this.#changeSize(halfLength);
    }
  }

  set(key, value) {
    const bucket = this.#getBucket(key);
    if (bucket.size === 0) {
      console.log("new bucket");
      this.#handleNewEntry();
      return bucket.append([key, value]);
    }

    const existingIndex = bucket.findKey(key);
    if (existingIndex === null) {
      console.log("new collision");
      this.#handleNewEntry();
      return bucket.append([key, value]);
    }

    console.log("overwrite entry");
    bucket.at(existingIndex).content = [key, value];
  }
  get(key) {
    const bucket = this.#getBucket(key);
    if (bucket.size === 0) return null;
    let node = bucket.head;
    while (true) {
      if (node.content[0] === key) return node.content[1];
      if (!node.next) return null;
      node = node.next;
    }
  }
  has(key) {
    return !!this.get(key);
  }
  remove(key) {
    const bucket = this.#getBucket(key);
    const index = bucket.findKey(key);
    if (index !== null) {
      this.#handleRemoveEntry();
      bucket.removeAt(index);
      return true;
    }
    return false;
  }
  length() {
    console.log(this.#buckets.length);
    return this.#entryCount;
  }
  clear() {
    this.#buckets = [];
    this.#entryCount = 0;
    HashMap.#createBuckets(this.#buckets, this.#defaultSize);
  }
  keys() {
    return HashMap.#visitAll(this.#buckets, (entry) => entry.content[0]);
  }
  values() {
    return HashMap.#visitAll(this.#buckets, (entry) => entry.content[1]);
  }
  entries() {
    return HashMap.#visitAll(this.#buckets, (entry) => entry.content);
  }
}
