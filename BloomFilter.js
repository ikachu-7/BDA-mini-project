// BloomFilter.js
class BloomFilter {
  constructor(size, hashFunctions) {
    this.size = size; // Size of the bit array
    this.hashFunctions = hashFunctions; // Number of hash functions
    this.bitArray = new Array(size).fill(false); // Initialize bit array
  }

  // Hash function to generate indices
  hash(value, seed) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = hash * seed + value.charCodeAt(i);
    }
    return Math.abs(hash % this.size);
  }

  // Method to add an item to the Bloom Filter
  add(item) {
    for (let i = 0; i < this.hashFunctions; i++) {
      const index = this.hash(item, i + 1); // Use different seeds for different hash functions
      this.bitArray[index] = true; // Set the bit at the index to true
    }
  }

  // Method to check if an item might be in the Bloom Filter
  has(item) {
    for (let i = 0; i < this.hashFunctions; i++) {
      const index = this.hash(item, i + 1);
      if (!this.bitArray[index]) {
        return false; // If any bit is false, the item is definitely not in the filter
      }
    }
    return true; // Item might be in the filter
  }
  hashFunction(item, seed) {
    let hash = 0;
    for (let i = 0; i < item.length; i++) {
      hash += item.charCodeAt(i) * (seed + 1);
    }
    return hash;
  }

  // Method to calculate false positive rate
  falsePositiveRate() {
    const p = Math.pow(
      1 - Math.exp(-this.hashFunctions / this.size),
      this.hashFunctions
    );
    return p; // Returns the false positive probability
  }
}

module.exports = BloomFilter;
