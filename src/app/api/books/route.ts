// src/app/api/books/route.ts
// import { NextResponse } from 'next/server';
// import { books } from '../../data/books';

// // GET /api/books - Return all books
// export async function GET() {
//   try {
//     return NextResponse.json(books);
//   } catch (err) {
//     console.error('Error fetching books:', err);
//     return NextResponse.json(
//       { error: 'Failed to fetch books' },
//       { status: 500 }
//     );
//   }
// }
// src/app/api/books/route.ts
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb'; // Import the MongoClient

// Remove the old local data import
// import { books } from '../../data/books';

// GET /api/books - Return all books from MongoDB
export async function GET() {
  // Get the MongoDB connection string from environment variables
  const uri = process.env.MONGODB_URI;

  // A quick check to make sure the URI is set
  if (!uri) {
    console.error('Error: MONGODB_URI environment variable is not set.');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // IMPORTANT: Replace <your_database_name> with your actual database name
    const database = client.db('test'); 
    const booksCollection = database.collection('books');

    // Find all documents in the 'books' collection
    const books = await booksCollection.find({}).toArray();

    // Return the books as a JSON response
    return NextResponse.json(books);
    
  } catch (err) {
    console.error('Error fetching books from database:', err);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  } finally {
    // Ensure that the client will close when you finish/error
    await client.close();
  }
}
// Future implementation notes:
// - Connect to a database (e.g., PostgreSQL, MongoDB)
// - Add authentication middleware for admin operations
// - Implement pagination for large datasets
// - Add filtering and search query parameters
// - Include proper error handling and logging
// - Add rate limiting for API protection
// - Implement caching strategies for better performance

// Example future database integration:
// import { db } from '@/lib/database';
// 
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const page = parseInt(searchParams.get('page') || '1');
//   const limit = parseInt(searchParams.get('limit') || '10');
//   const genre = searchParams.get('genre');
//   
//   try {
//     const books = await db.books.findMany({
//       where: genre ? { genre: { contains: genre } } : {},
//       skip: (page - 1) * limit,
//       take: limit,
//     });
//     
//     return NextResponse.json(books);
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Database connection failed' },
//       { status: 500 }
//     );
//   }
// }