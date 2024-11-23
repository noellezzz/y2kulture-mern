import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchData } from '../../admin/utils/crudUtils'; // Utility function for API calls
import toast from 'react-hot-toast';
import './styles/Shared.css'; // Assuming separate styles for Store
import { MdStarRate } from 'react-icons/md';

const Store = () => {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1); // Pagination
  const [hasMore, setHasMore] = useState(true); // Whether more products are available
  const [isLoading, setIsLoading] = useState(false); // Prevent duplicate calls
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // New states for filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    loadProducts(page, selectedCategory, priceRange);
    checkLogin();
  }, [page, selectedCategory, priceRange]); // Reload products when `page`, `selectedCategory` or `priceRange` changes

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50 && hasMore && !isLoading) {
        setPage((prevPage) => prevPage + 1); // Load next page
      }
    };

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]); // Only attach the listener once

  const loadProducts = async (currentPage, category, priceRange) => {
    if (isLoading) return; // Prevent duplicate requests
    setIsLoading(true);
    try {
      const query = `product?page=${currentPage}&limit=10&category=${category}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;
      const response = await fetchData(query);
      if (!response || response.length === 0) {
        setHasMore(false); // No more products to fetch
      } else {
        setProductList((prevProducts) => [...prevProducts, ...response]);
      }
    } catch (error) {
      toast.error('Failed to fetch products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/auth');
      setUserLoggedIn(true);
    } catch {
      setUserLoggedIn(false);
    }
  };

  const addToCart = (productId) => {
    if (!userLoggedIn) {
      toast.error('Please Log In First!');
      return;
    }
    toast.success(`Product ${productId} added to cart!`);
    // Add logic for adding to cart here.
  };

  // Handlers for filters
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriceRangeChange = (e) => {
    setPriceRange([Number(e.target.value[0]), Number(e.target.value[1])]);
  };

  return (
    <div className="store-container">
      <div className="store-header">
        <h1>Our Products</h1>
        <p>Explore our collection and find your perfect style!</p>
      </div>

      {/* Filters Section */}
      <div className="filters">
        <select onChange={handleCategoryChange} value={selectedCategory}>
          <option value="">All Categories</option>
          <option value="category1">Category 1</option>
          <option value="category2">Category 2</option>
          {/* Add more categories as needed */}
        </select>

        <input 
          type="range" 
          min="0" 
          max="1000" 
          value={priceRange} 
          onChange={handlePriceRangeChange} 
        />
        <span>Price Range: ${priceRange[0]} - ${priceRange[1]}</span>
      </div>

      <div className="store-grid">
        {productList.length === 0 ? (
          <p>No products available at the moment.</p>
        ) : (
          productList.map((product, index) => (
            <div key={index} className="store-product-card">
              <div className="product-image">
                <img
                  src="https://placehold.co/200x300" // Placeholder or dynamic product image
                  alt={product.title}
                />
              </div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <p className="product-category">{product.category[0]?.title || 'Uncategorized'}</p>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: ${product.price}</p>
              </div>
              <div className="product-controls">
                <button
                  onClick={() => addToCart(product._id)}
                  className="prime-button"
                >
                  Add to Cart
                </button>
                {product.reviews?.length > 0 && (
                  <div className="product-rating">
                    <MdStarRate />
                    <span>
                      {(
                        product.reviews.reduce((sum, review) => sum + review.rating, 0) /
                        product.reviews.length
                      ).toFixed(1)}{' '}
                      Stars
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && <p>Loading more products...</p>} {/* Show loading spinner */}
      </div>
      {!hasMore && (
        <p>No more products to show.</p>
      )}
    </div>
  );
};

export default Store;
