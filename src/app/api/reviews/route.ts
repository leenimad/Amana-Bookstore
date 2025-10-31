// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Common setup for database connection
const uri = process.env.MONGODB_URI || '';
// IMPORTANT: Replace <your_database_name> with your actual database name
const dbName = 'test'; 

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// GET /api/reviews - Get all reviews from the database
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');
  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    const database = client.db('<your_database_name>');
    const reviewsCollection = database.collection('reviews');

    // If a bookId is provided in the URL, filter by it. Otherwise, get all reviews.
    const query = bookId ? { bookId: bookId } : {};
    
    const reviews = await reviewsCollection.find(query).toArray();
    return NextResponse.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST /api/reviews - Add a new review to the database
export async function POST(request: Request) {
  const client = new MongoClient(uri);
  try {
    // 1. Get the new review from the request body
    const newReview = await request.json();

    // Optional: Add a timestamp to the review
    newReview.createdAt = new Date();

    await client.connect();
    const database = client.db(dbName);
    const reviewsCollection = database.collection('reviews'); // <-- Targets the 'reviews' collection

    // 2. Insert the new review into the database
    const result = await reviewsCollection.insertOne(newReview);

    // 3. Return a success response
    return NextResponse.json(
      { message: 'Review added successfully', insertedId: result.insertedId },
      { status: 201 } // 201 Created status
    );
  } catch (err) {
    console.error('Error adding review:', err);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}