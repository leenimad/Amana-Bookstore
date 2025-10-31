// src/app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = 'test';

// GET /api/cart - Get cart items with full book details
export async function GET() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbName);
    const cartCollection = database.collection('cart');
    
    // Use MongoDB aggregation to join cart items with book details
    const cartItems = await cartCollection.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: 'id',
          as: 'bookDetails'
        }
      },
      { $unwind: '$bookDetails' },
      { $project: { _id: 1, quantity: 1, bookId: 1, book: '$bookDetails' } }
    ]).toArray();
    
    return NextResponse.json(cartItems);
 } catch (err) {
    console.error('Error getting cartitems :', err);
    return NextResponse.json(
      { error: 'Failed to get items from cart' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
// POST /api/cart - Add a new item to the cart in the database
export async function POST(request: Request) {
  const client = new MongoClient(uri);
  try {
    // 1. Get the item to add from the request body
    const newItem = await request.json();

    // Optional: Add validation here to ensure newItem has the correct structure

    await client.connect();
    const database = client.db(dbName);
    const cartCollection = database.collection('cart');

    // 2. Insert the new item into the database
    const result = await cartCollection.insertOne(newItem);

    // 3. Return a success response
    return NextResponse.json(
      { message: 'Item added to cart successfully', insertedId: result.insertedId },
      { status: 201 } // 201 Created is the standard status for successful creation
    );
  } catch (err) {
    console.error('Error adding item to cart:', err);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// PUT /api/cart - Update an item's quantity
export async function PUT(request: Request) {
  const client = new MongoClient(uri);
  try {
    const { bookId, quantity } = await request.json();
    if (!bookId || quantity < 1) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await client.connect();
    const database = client.db(dbName);
    const cartCollection = database.collection('cart');
    await cartCollection.updateOne({ bookId: bookId }, { $set: { quantity: quantity } });
    
    return NextResponse.json({ message: 'Cart item updated' });
  } catch (err) {
    console.error('Error updating cart :', err);
    return NextResponse.json(
      { error: 'Failed update cart' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}


// DELETE /api/cart - Remove an item or clear the cart
export async function DELETE(request: Request) {
  const client = new MongoClient(uri);
  try {
    const body = await request.json().catch(() => null);

    await client.connect();
    const database = client.db(dbName);
    const cartCollection = database.collection('cart');

    if (body && body.bookId) {
      await cartCollection.deleteOne({ bookId: body.bookId });
      return NextResponse.json({ message: 'Item removed' });
    } else {
      await cartCollection.deleteMany({});
      return NextResponse.json({ message: 'Cart cleared' });
    }
 } catch (err) {
    console.error('Error deleting item from cart:', err);
    return NextResponse.json(
      { error: 'Failed to delete item from cart' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
