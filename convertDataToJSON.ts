import { writeFileSync } from "fs";
import * as path from "path";

// Import your data
import { books } from "./src/app/data/books";
import { initialCart } from "./src/app/data/cart";
import { reviews } from "./src/app/data/reviews";

// Helper function to export any dataset to JSON
function exportToJson(data: any, name: string) {
  const filePath = path.join(__dirname, `${name}.json`);
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ ${name}.json created successfully!`);
}

// Export each dataset
exportToJson(books, "books");
exportToJson(initialCart, "cart");
exportToJson(reviews, "reviews");
