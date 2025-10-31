// // src/app/book/[id]/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { books } from '../../data/books';
// import { reviews } from '../../data/reviews';
// import { Book, CartItem, Review } from '../../types';

// export default function BookDetailPage() {
//   const [book, setBook] = useState<Book | null>(null);
//   const [bookReviews, setBookReviews] = useState<Review[]>([]);
//   const [quantity, setQuantity] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const params = useParams();
//   const router = useRouter();
//   const { id } = params;

//   useEffect(() => {
//     if (id) {
//       const foundBook = books.find((b) => b.id === id);
//       if (foundBook) {
//         setBook(foundBook);
//         // Get reviews for this book
//         const bookReviewsData = reviews.filter((review) => review.bookId === id);
//         setBookReviews(bookReviewsData);
//       } else {
//         setError('Book not found.');
//       }
//       setIsLoading(false);
//     }
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!book) return;

//     const cartItem: CartItem = {
//       id: `${book.id}-${Date.now()}`,
//       bookId: book.id,
//       quantity: quantity,
//       addedAt: new Date().toISOString(),
//     };
//     // Retrieve existing cart from localStorage
//     const storedCart = localStorage.getItem('cart');
//     const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
//     // Check if the book is already in the cart
//     const existingItemIndex = cart.findIndex((item) => item.bookId === book.id);

//     if (existingItemIndex > -1) {
//       // Update quantity if item already exists
//       cart[existingItemIndex].quantity += quantity;
//     } else {
//       // Add new item to cart
//       cart.push(cartItem);
//     }
//     // Save updated cart to localStorage
//     localStorage.setItem('cart', JSON.stringify(cart));
//     // Dispatch a custom event to notify the Navbar
//     window.dispatchEvent(new CustomEvent('cartUpdated'));
//     // Redirect to the cart page after adding
//     router.push('/cart');
//   };
  // src/app/book/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, Review } from '../../types'; // Removed CartItem as we create it on the fly

export default function BookDetailPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [bookReviews, setBookReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchBookData = async () => {
        setIsLoading(true);
        try {
          // Fetch book details from our new API endpoint
          const bookRes = await fetch(`/api/books/${id}`);
          if (!bookRes.ok) throw new Error('Book not found.');
          const bookData: Book = await bookRes.json();
          setBook(bookData);

          // Fetch reviews for this book using our updated reviews API
          const reviewsRes = await fetch(`/api/reviews?bookId=${id}`);
          if (!reviewsRes.ok) throw new Error('Could not fetch reviews.');
          const reviewsData: Review[] = await reviewsRes.json();
          setBookReviews(reviewsData);
          
          setError(null);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBookData();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!book) return;

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id, quantity: quantity }),
      });

      if (!res.ok) {
        throw new Error('Failed to add item to cart');
      }

      window.dispatchEvent(new CustomEvent('cartUpdated'));
      router.push('/cart');
    } catch (error) {
      console.error(error);
      alert('Could not add item to cart. Please try again.');
    }
  };
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <svg className="w-4 h-4 text-gray-300 fill-current absolute" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return <div className="flex items-center">{stars}</div>;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <Link href="/" className="text-green-500 hover:underline mt-4 inline-block cursor-pointer">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!book) {
    return null; // Should be handled by error state
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Image */}
        <div className="relative h-96 md:h-[600px] w-full shadow-lg rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
          {/* Book Icon Placeholder */}
          <div className="text-8xl text-gray-400">📚</div>
        </div>

        {/* Book Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          
          <div className="flex items-center mb-4">
            {renderStars(book.rating)}
            <span className="text-md text-gray-500 ml-2">({book.reviewCount} reviews)</span>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>
          
          <div className="mb-4">
            <span className="font-semibold">Format:</span>
            <span className="ml-2 inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700">{book.format}</span>
          </div>

          <div className="mb-4">
            {book.genre.map((g) => (
              <span key={g} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {g}
              </span>
            ))}
          </div>

          <div className="text-3xl font-bold text-green-600 mb-6">${book.price.toFixed(2)}</div>

          <div className="flex items-center space-x-4 mb-6">
            <label htmlFor="quantity" className="font-semibold">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors duration-300 text-lg font-semibold cursor-pointer"
          >
            Add to Cart
          </button>

          <Link href="/" className="text-green-500 hover:underline mt-6 text-center cursor-pointer">
            &larr; Back to Home
          </Link>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
        
        {bookReviews.length > 0 ? (
          <div className="space-y-6">
            {bookReviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{formatDate(review.timestamp)}</span>
                    {review.verified && (
                      <>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{review.title}</h3>
                <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">by {review.author}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
          </div>
        )}
      </div>
    </div>
  );
}
