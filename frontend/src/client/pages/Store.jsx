import React, { useState, useEffect } from 'react';
import { fetchDataN } from '../../admin/utils/crudUtils';
import toast from 'react-hot-toast';
import './styles/Shared.css';
import { MdStarRate } from 'react-icons/md';
import axios from 'axios';
import ConfirmModal from '../components/ConfirmModal';
import { CSSTransition } from 'react-transition-group';

const Store = () => {
  const [productInfo, setProductInfo] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [productList, setProductList] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    rating: '',
    sortBy: '',
  });

  useEffect(() => {
    loadFilteredProducts();
    checkLogin();
  }, [filters]);

  const loadFilteredProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/product?limit=1000');
      let filteredProducts = response.data.data;
  
      // Filter by Category
      if (filters.category) {
        filteredProducts = filteredProducts.filter((product) =>
          product.category.some((cat) => cat.title === filters.category)
        );
      }
  
      
      // Filter by Price
      if (filters.price) {
        const priceRange = filters.price.split('-').map(Number);
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
        );
      }
  
      // Filter by Rating
      if (filters.rating) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.reviews &&
            product.reviews.length > 0 &&
            product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              product.reviews.length >= filters.rating
        );
      }
  
      // Sort Products
      if (filters.sortBy) {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (filters.sortBy === 'price-asc') return a.price - b.price;
          if (filters.sortBy === 'price-desc') return b.price - a.price;
          if (filters.sortBy === 'name-asc') return a.title.localeCompare(b.title);
          if (filters.sortBy === 'name-desc') return b.title.localeCompare(a.title);
          return 0;
        });
      }
  
      setProductList(filteredProducts);
  
      if (filteredProducts.length === 0) {
        toast.error('No products found with the selected filters');
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };  

  const checkLogin = async () => {
    try {
      await axios.get('http://localhost:8000/auth');
      setUserLoggedIn(true);
    } catch {
      setUserLoggedIn(false);
    }
  };

  const addToCart = async (productId) => {
    if (!userLoggedIn) {
      toast.error('Please Log In First!');
      return;
    }
    const result = await fetchDataN('product', productId);
    setProductInfo(result.data.data);
    setOpenModal(true);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      price: '',
      rating: '',
      sortBy: '',
    });
  };

  return (
    <div className="store-page">
      <div className="store-header">
        <h1>Our Products</h1>
        <p>Explore our collection and find your perfect style!</p>
      </div>

      <div className="filters">
      <select name="category" value={filters.category} onChange={handleFilterChange}>
        <option value="">Select Category</option>
        {productList
          .flatMap((product) => product.category) // Flatten categories
          .filter((cat, index, self) => index === self.findIndex((c) => c.title === cat.title)) // Remove duplicates
          .map((cat) => (
            <option key={cat._id} value={cat.title}>
              {cat.title}
            </option>
          ))}
      </select>
      
      <select name="price" value={filters.price} onChange={handleFilterChange}>
        <option value="">Select Price Range</option>
        <option value="1-1000">$1 - $1000</option>
        <option value="1000-5000">$1000 - $5000</option>
        <option value="5000-10000">$5000 - $10000</option>
        <option value="10000-100000">$10000 - $100000</option>
      </select>

      <select name="rating" value={filters.rating} onChange={handleFilterChange}>
        <option value="">Select Minimum Rating</option>
        <option value="1">1 Star</option>
        <option value="2">2 Stars</option>
        <option value="3">3 Stars</option>
        <option value="4">4 Stars</option>
        <option value="5">5 Stars</option>
      </select>

      <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
        <option value="">Sort By</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
      </select>

      <button onClick={clearFilters}>Clear Filters</button>
    </div>


      <div className="store-content">
        <div className="store-grid">
          {productList.length === 0 ? (
            <div className="no-products">
              <p>No products available.</p>
            </div>
          ) : (
            productList.map((product, index) => (
              <div key={`${product._id}-${index}`} className="store-product-card">
                <div className="product-image">
                  <img
                    src={product.images[0]?.url || "https://placehold.co/200x300"}
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
                  <button onClick={() => addToCart(product._id)} className="prime-button">
                    Add to Cart
                  </button>
                  {product.reviews?.length > 0 && (
                    <div className="product-rating">
                      <MdStarRate />
                      <span>
                        {(product.reviews.reduce((sum, review) => sum + review.rating, 0) /
                          product.reviews.length).toFixed(1)}{' '}
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

      <CSSTransition in={openModal} timeout={300} classNames="modal" unmountOnExit>
        <ConfirmModal setModalOpen={setOpenModal} productInfo={productInfo} />
      </CSSTransition>
    </div>
  );
};

export default Store;
