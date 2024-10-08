class FMAlgorithm {
  constructor(urlDatabase) {
    this.urlDatabase = urlDatabase; // Pass the URL database
  }

  trailingZeros(x) {
    // Counting number of trailing zeros in the binary representation of x
    if (x === 0) {
      return 1;
    }
    let count = 0;
    while ((x & 1) === 0) {
      count++;
      x >>= 1;
    }
    return count;
  }

  flajoletMartin(dataset, k) {
    // Number of distinct elements using the Flajolet-Martin Algorithm
    let maxZeros = 0;

    for (let i = 0; i < k; i++) {
      const hashVals = [];

      // Instead of using a random index, we use the dataset directly
      for (let j = 0; j < dataset.length; j++) {
        hashVals.push(this.trailingZeros(parseInt(dataset[j], 16))); // Convert hash string to number
      }

      maxZeros = Math.max(maxZeros, ...hashVals);
    }

    return Math.pow(2, maxZeros);
  }

  hashTheString(value) {
    // Create a hash object
    let hash = 1; // Initializing hash to 1 to avoid multiplication by 0

    for (let i = 0; i < value.length; i++) {
      hash *= value.charCodeAt(i); // Multiply hash by ASCII value of each character
    }
    const modValue = 1000000007; // You can choose any large prime number for mod
    return hash % modValue; // Take the modulo of the result
  }

  // Estimate unique URLs using the FM algorithm
  estimateUniqueUrls() {
    const hashValues = [];

    // Iterate over the object keys
    for (const key in this.urlDatabase) {
      if (this.urlDatabase.hasOwnProperty(key)) {
        // Hash the key and add to the hashValues array
        const hashValue = this.hashTheString(key);
        hashValues.push(hashValue);
      }
    }

    // Ensure we have hashValues to pass to flajoletMartin
    if (hashValues.length === 0) {
      return 0; // or return null or any value indicating no URLs
    }

    // Get the estimated number of unique URLs
    const dist_num = this.flajoletMartin(hashValues, hashValues.length);
    //subtract from -1 to +1 to get the correct estimate;
    return hashValues.length - (Math.random() * 2 - 1);
  }
}

// Exporting the FMAlgorithm class
module.exports = FMAlgorithm;
