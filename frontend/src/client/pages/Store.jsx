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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSorts, setSelectedSorts] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableGenders, setAvailableGenders] = useState(['Men', 'Women', 'Unisex']);
  const observer = useRef();

  const priceRanges = [
    { min: 1000, max: 2000, label: '$1,000 - $2,000' },
    { min: 2000, max: 3000, label: '$2,000 - $3,000' },
    { min: 3000, max: 4000, label: '$3,000 - $4,000' },
    { min: 4000, max: 5000, label: '$4,000 - $5,000' },
    { min: 5000, max: 7500, label: '$5,000 - $7,500' },
    { min: 7500, max: 10000, label: '$7,500 - $10,000' },
    { min: 10000, max: null, label: 'Over $10,000' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/category');
        if (response.data.success) {
          const categories = response.data.data;
          console.log('Available categories from database:', categories);
          setAvailableCategories(categories.map(cat => cat.title));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    loadFilteredProducts();
    checkLogin();
  }, [selectedCategories, selectedGenders, selectedSorts, selectedPriceRanges]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(cat => cat !== category) : [...prev, category]
    );
  };

  const handleGenderChange = (gender) => {
    setSelectedGenders(prev =>
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  const handleSortChange = (sort) => {
    setSelectedSorts(prev => {
      const field = sort.startsWith('title') ? 'title' : 'price';
      const newSorts = prev.filter(s => !s.startsWith(field));
      return prev.includes(sort) ? newSorts : [...newSorts, sort];
    });
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRanges(prev => {
      const isSelected = prev.some(r => r.min === range.min && r.max === range.max);
      if (isSelected) {
        return prev.filter(r => !(r.min === range.min && r.max === range.max));
      }
      return [...prev, range];
    });
  };

  const loadFilteredProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      selectedCategories.forEach(category => params.append('categoryType', category));
      selectedGenders.forEach(gender => params.append('gender', gender));
      selectedSorts.forEach(sort => params.append('sortFields', sort));
      
      // Add price range parameters
      selectedPriceRanges.forEach(range => {
        params.append('minPrice', range.min);
        if (range.max) {
          params.append('maxPrice', range.max);
        }
      });
      
      params.append('limit', '1000');
      
      const response = await axios.get(`http://localhost:8000/api/product?${params}`);
      
      setAllProducts(response.data.data);
      setProductList(response.data.data.slice(0, 12));
      setPage(1);
      setTotalPages(Math.ceil(response.data.data.length / 12));

      if (response.data.data.length === 0) {
        toast.error('No products found for the selected filters');
      }
    } catch (error) {
      console.error('Error loading filtered products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNextPage = () => {
    if (loading) return;
    setLoading(true);
    
    setPage(prevPage => {
      const startIdx = (prevPage * 12) % allProducts.length;
      const endIdx = startIdx + 12;
      const nextProducts = [
        ...allProducts.slice(startIdx, Math.min(endIdx, allProducts.length)),
        ...(endIdx > allProducts.length ? allProducts.slice(0, endIdx - allProducts.length) : [])
      ];
      setProductList(prev => [...prev, ...nextProducts]);
      setLoading(false);
      return prevPage + 1;
    });
  };

  const lastProductRef = useCallback(node => {
    if (loading || !node) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadNextPage();
    });
    observer.current.observe(node);
  }, [loading]);

  const checkLogin = async () => {
    try {
      await axios.get('http://localhost:8000/auth');
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
    <div className="store-page">
      <div className="store-header">
        <h1>Our Products</h1>
        <p>Explore our collection and find your perfect style!</p>
      </div>

      <div className="store-layout">
        <div className="filter-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            {availableCategories.map(category => (
              <label key={category} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h3>Gender</h3>
            {availableGenders.map(gender => (
              <label key={gender} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedGenders.includes(gender)}
                  onChange={() => handleGenderChange(gender)}
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            {priceRanges.map((range, index) => (
              <label key={index} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedPriceRanges.some(r => r.min === range.min && r.max === range.max)}
                  onChange={() => handlePriceRangeChange(range)}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h3>Sort By Name</h3>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedSorts.includes('titleAsc')}
                onChange={() => handleSortChange('titleAsc')}
              />
              <span>A to Z</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedSorts.includes('titleDesc')}
                onChange={() => handleSortChange('titleDesc')}
              />
              <span>Z to A</span>
            </label>
          </div>

          <div className="filter-section">
            <h3>Sort By Price</h3>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedSorts.includes('priceAsc')}
                onChange={() => handleSortChange('priceAsc')}
              />
              <span>Low to High</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedSorts.includes('priceDesc')}
                onChange={() => handleSortChange('priceDesc')}
              />
              <span>High to Low</span>
            </label>
          </div>
        </div>

        <div className="store-content">
          <div className="store-grid">
            {productList.length === 0 ? (
              <div className="no-products">
                <p>No products available for the selected filters.</p>
              </div>
            ) : (
              productList.map((product, index) => (
                <div 
                  key={`${product._id}-${index}`}
                  ref={index === productList.length - 1 ? lastProductRef : null}
                  className="store-product-card"
                >
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
      </div>
    </div>
  );
};

export default Store;