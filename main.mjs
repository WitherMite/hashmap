import HashMap from "./hashmap.mjs";

const test = new HashMap();

test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");
test.set("dog", "black");
console.log(test.length());

console.log(test);

test.set("moon", "silver");
console.log(test.length());
console.log(test.remove("dog"));
console.log(test.remove("moon"));
console.log(test.remove("lion"));
console.log(test.remove("ice cream"));
console.log(test.remove("frog"));
console.log(test.remove("hat"));
console.log(test.remove("apple"));
console.log(test.length());
console.log(test.get("jacket"));
console.log(test.has("dog"));
console.log(test.has("ant"));

console.log(test.has("dog"));
console.log(test.length());
console.log(test.keys());
console.log(test.values());
console.log(test.entries());
test.clear();
console.log(test.length());
console.log(test.entries());
