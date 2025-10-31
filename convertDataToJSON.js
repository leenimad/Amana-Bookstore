"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
// Import your data
var books_1 = require("./src/app/data/books");
var cart_1 = require("./src/app/data/cart");
var reviews_1 = require("./src/app/data/reviews");
// Helper function to export any dataset to JSON
function exportToJson(data, name) {
    var filePath = path.join(__dirname, "".concat(name, ".json"));
    (0, fs_1.writeFileSync)(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("\u2705 ".concat(name, ".json created successfully!"));
}
// Export each dataset
exportToJson(books_1.books, "books");
exportToJson(cart_1.initialCart, "cart");
exportToJson(reviews_1.reviews, "reviews");
