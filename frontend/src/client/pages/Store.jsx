import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchData } from '../../admin/utils/crudUtils';
import toast from 'react-hot-toast';
import './styles/Shared.css';
import { MdStarRate } from 'react-icons/md';
import axios from 'axios';

const Store = () => {
  const [productList, setProductList] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const observer = useRef();

  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading]);

  useEffect(() => {
    // Initial load of all products
    const loadAllProducts = async () => {
      try {
        const response = await fetchData('product', setAllProducts, 1, 1000); // Load all products
        setTotalPages(response.totalPages);
        setProductList(response.data);
      } catch (error) {
        console.error('Error loading all products:', error);
      }
    };
    loadAllProducts();
    checkLogin();
  }, []);

  const loadNextPage = () => {
    if (loading) return;
    setLoading(true);
    
    // Calculate the next set of products to show
    setPage(prevPage => {
      const nextPage = prevPage + 1;
      const startIdx = ((prevPage - 1) * 12) % allProducts.length;
      const endIdx = startIdx + 12;
      
      // Get next set of products, wrapping around if needed
      const nextProducts = [
        ...allProducts.slice(startIdx, Math.min(endIdx, allProducts.length)),
        ...(endIdx > allProducts.length ? allProducts.slice(0, endIdx - allProducts.length) : [])
      ];

      // Append the next set of products
      setProductList(prev => [...prev, ...nextProducts]);
      setLoading(false);
      return nextPage;
    });
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
  };

  return (
    <div className="store-container">
      <div className="store-header">
        <h1>Our Products</h1>
        <p>Explore our collection and find your perfect style!</p>
      </div>
      <div className="store-grid">
        {productList.length === 0 ? (
          <p>No products available at the moment.</p>
        ) : (
          productList.map((product, index) => (
            <div 
              key={`${product._id}-${index}`}
              ref={index === productList.length - 1 ? lastProductRef : null}
              className="store-product-card"
            >
              <div className="product-image">
                <img
                  src="https://placehold.co/200x300"
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
      </div>
      {loading && <div className="loading">Loading more products...</div>}
    </div>
  );
};

export default Store;