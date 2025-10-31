// // src/app/api/books/[id]/route.ts
// import { NextResponse } from 'next/server';
// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI! ;
// // Make sure your database name is in your .env.local file
// const dbName = 'test';

// if (!uri) {
//   throw new Error('Please define the MONGODB_URI environment variable');
// }

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   const { id } = params;

//     const client = new MongoClient(uri);
//   try {
//     await client.connect();
//     const database = client.db(dbName);
//     const booksCollection = database.collection('books');
    
//     // Find the book by its original 'id' field, not the MongoDB '_id'
//     const book = await booksCollection.findOne({ id: id });

//     if (!book) {
//       return NextResponse.json({ error: 'Book not found' }, { status: 404 });
//     }
//     return NextResponse.json(book);
//   } catch (err) {
//     console.error(`Error fetching book with id: ${params.id}`, err);
//     return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
//   } finally {
//     await client.close();
//   }
// }
// src/app/api/books/[id]/route.ts
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
// Make sure to replace this with your actual database name
const dbName = 'test';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// We still need the second argument for Next.js to recognize this as a dynamic route,
// but we will not use it directly to avoid the error.
export async function GET(request: Request, { params }: { params: { id: string } }) {
  
  // WORKAROUND: We get the ID from the URL directly.
  // The URL pathname will be something like "/api/books/4"
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split('/');
  const id = segments.pop(); // .pop() gets the last segment, which is the ID

  if (!id) {
    return NextResponse.json({ error: 'Book ID is missing from URL' }, { status: 400 });
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbName);
    const booksCollection = database.collection('books');
    
    // Find the book using the ID we extracted from the URL
    const book = await booksCollection.findOne({ id: id });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (err) {
    console.error(`Error fetching book with id: ${id}`, err);
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  } finally {
    await client.close();
  }
}