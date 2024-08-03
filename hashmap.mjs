import LinkedListBucket from "./linked-list-bucket.mjs";

// enforce a size limit on the buckets array for the exercise
// assume string keys
export default class HashMap {
  static #createBuckets(arr, size) {
    for (let i = 0; i < size; i++) {
      arr.push(new LinkedListBucket());
    }
  }
  static #reduceAll(buckets, callback) {
    const all = [];
    buckets.forEach((bucket) => {
      if (bucket.size === 0) return;
      let node = bucket.head;
      while (true) {
        if (node === null) return;
        all.push(callback(node));
        node = node.next;
      }
    });
    return all;
  }

  #buckets = [];
  #defaultSize;
  #capacity = 0;
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
  #handleNewEntry() {
    const overCapacity =
      ++this.#capacity / this.#buckets.length > this.loadFactor;
    if (overCapacity) {
      console.log("over capacity");
      // grow
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
      this.#capacity--; // change to handleRemoveEntry and shrink buckets
      bucket.removeAt(index);
      return true;
    }
    return false;
  }
  length() {
    return this.#capacity;
  }
  clear() {
    const empty = [];
    HashMap.#createBuckets(empty, this.#defaultSize);
    this.#buckets = empty;
    this.#capacity = 0;
  }
  keys() {
    return HashMap.#reduceAll(this.#buckets, (entry) => entry.content[0]);
  }
  values() {
    return HashMap.#reduceAll(this.#buckets, (entry) => entry.content[1]);
  }
  entries() {
    return HashMap.#reduceAll(this.#buckets, (entry) => entry.content);
  }
}
