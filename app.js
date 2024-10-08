// app.js
const express = require("express");
const path = require("path");
const BloomFilter = require("./BloomFilter"); // Import the custom Bloom Filter class
const FMAlgorithm = require("./fmAlgo"); // Import the FMAlgorithm class

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Initialize the Bloom Filter
const bloomFilter = new BloomFilter(1000, 5); // 1000 bits and 5 hash functions

// POST endpoint to initiate URL shortening
urlDatabase = {};
app.post("/initiate", (req, res) => {
  const { name, url } = req.body;

  // Validate input
  if (!name || !url) {
    return res.status(400).json({ error: "Name and URL are required" });
  }

  // Check if the URL name already exists in the Bloom Filter
  if (bloomFilter.has(name)) {
    return setTimeout(() => {
      res.status(400).json({ error: "This URL name already exists." });
    }, 3000);
  }

  // Generate a short URL
  const shortUrl = `http://short.url/${name}`;

  // Add the URL name to the Bloom Filter
  bloomFilter.add(name);
  urlDatabase[name] = url;

  // Introduce a delay before sending the response (simulate processing time)
  setTimeout(() => {
    // Send the short URL back to the client
    res.json({ shortUrl });
  }, 3000); // Delay of 3000 milliseconds (3 seconds)
});

app.get("/redirect/:name", (req, res) => {
  const name = req.params.name; // Retrieve the 'name' from the URL parameter

  // Check if the name exists in the URL database
  if (urlDatabase[name]) {
    const originalUrl = urlDatabase[name];
    res.redirect(originalUrl); // Redirect to the original URL
  } else {
    res.status(404).send("Short URL not found."); // Handle case where the URL name doesn't exist
  }
});

// GET endpoint for estimating unique URLs using the FM algorithm
app.get("/fm-algo", (req, res) => {
  console.log("i m here");
  const fmAlgorithm = new FMAlgorithm(urlDatabase);
  const estimate = fmAlgorithm.estimateUniqueUrls();
  console.log(estimate);
  res.json({ estimate }); // Send back the estimate as JSON
  console.log("boom");
});

// GET endpoint to render the main page
app.get("/", (req, res) => {
  res.render("index");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
