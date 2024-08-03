import LinkedListBucket from "./linked-list-bucket.mjs";

// enforce a size limit on the buckets array for the exercise
// assume string keys
export default class HashMap {
  #buckets = [];
  constructor(load = 0.75, size = 16) {
    this.loadFactor = load;
    this.capacity = 0;
    for (let i = 0; i < size; i++) {
      this.#buckets.push(new LinkedListBucket());
    }
  }

  #getBucket(index) {
    if (index < 0 || index >= this.#buckets.length) {
      throw new Error("Trying to access index out of bound", { cause: index });
    } else return this.#buckets[index];
  }
  #hash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
      hashCode = hashCode % this.#buckets.length;
    }
    return hashCode;
  }

  set(key, value) {
    const hash = this.#hash(key);
    const bucket = this.#getBucket(hash);
    if (bucket.size === 0) {
      console.log("new bucket");
      this.capacity++;
      return bucket.append([key, value]);
    }

    const existingIndex = bucket.findKey(key);
    if (existingIndex === null) {
      console.log("new collision");
      this.capacity++;
      return bucket.append([key, value]);
    }
    console.log("overwrite entry");
    bucket.at(existingIndex).content = [key, value];
  }
}
