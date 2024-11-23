import React, { useState, useEffect } from 'react';
import { fetchData } from '../../admin/utils/crudUtils'; // Utility function for API calls
import toast from 'react-hot-toast';
import './styles/Shared.css'; // Assuming separate styles for Store
import { MdStarRate } from 'react-icons/md';

const Store = () => {
  const [productList, setProductList] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch products when the component mounts
    fetchData('product', setProductList);
    checkLogin();
  }, []);

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
      </div>
    </div>
  );
};

export default Store;