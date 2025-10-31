// // src/app/types/index.ts

// export interface Book {
//   id: string;
//   title: string;
//   author: string;
//   description: string;
//   price: number;
//   image: string;
//   isbn: string;
//   genre: string[];
//   tags: string[];
//   datePublished: string;
//   pages: number;
//   language: string;
//   publisher: string;
//   rating: number;
//   reviewCount: number;
//   inStock: boolean;
//   featured: boolean;
//    format: string; 
// }

// export interface CartItem {
//   id: string;
//   bookId: string;
//   quantity: number;
//   addedAt: string;
// }

// export interface Review {
//   id: string;
//   bookId: string;
//   author: string;
//   rating: number;
//   title: string;
//   comment: string;
//   timestamp: string;
//   verified: boolean;
// }
// src/app/types/index.ts
export interface Book {
_id: string; // From MongoDB
id: string; // Original ID from data file, used for linking
title: string;
author: string;
description: string;
price: number;
image: string;
isbn: string;
genre: string[];
tags: string[];
datePublished: string;
pages: number;
language: string;
publisher: string;
rating: number;
reviewCount: number;
inStock: boolean;
featured: boolean;
format: string;
}
export interface CartItem {
_id: string; // From MongoDB
id: string;
bookId: string;
quantity: number;
addedAt: string;
}
// The cart API will now return this shape
export interface CartItemWithBook {
_id: string; // The cart item's ID
quantity: number;
book: Book; // The nested book details
}
export interface Review {
_id: string; // From MongoDB
id: string;
bookId: string;
author: string;
rating: number;
title: string;
comment: string;
timestamp: string;
verified: boolean;
}