// // src/app/page.tsx
// 'use client';

// import { useState } from 'react';
// import BookGrid from './components/BookGrid';
// import { books } from './data/books';

// export default function HomePage() {
//   // Simple cart handler for demo purposes
//   const handleAddToCart = (bookId: string) => {
//     console.log(`Added book ${bookId} to cart`);
//     // Here you would typically dispatch to a cart state or call an API
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Welcome Section */}
//       <section className="text-center bg-green-100 p-8 rounded-lg mb-12 shadow-md">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome to the Amana Bookstore!</h1>
//         <p className="text-lg text-gray-600">
//           Your one-stop shop for the best books. Discover new worlds and adventures.
//         </p>
//       </section>

//       {/* Book Grid */}
//       <BookGrid books={books} onAddToCart={handleAddToCart} />
//     </div>
//   );
// }
// src/app/page.tsx
import BookGrid from './components/BookGrid';
import { Book } from './types';

// This function now runs on the server to fetch data
async function getBooks(): Promise<Book[]> {
  try {
    // In production, use an absolute URL from an environment variable
    const res = await fetch('http://localhost:3000/api/books', { 
      cache: 'no-store' // Ensures you always get fresh data
    });
    if (!res.ok) {
      console.error('Failed to fetch books');
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Error in getBooks:', error);
    return [];
  }
}

export default async function HomePage() {
  const books = await getBooks();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center bg-green-100 p-8 rounded-lg mb-12 shadow-md">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome to the Amana Bookstore!</h1>
        <p className="text-lg text-gray-600">
          Your one-stop shop for the best books. Discover new worlds and adventures.
        </p>
      </section>
      
      {/* BookGrid is a client component that now receives the data via props */}
      <BookGrid books={books} />
    </div>
  );
}
