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
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSorts, setSelectedSorts] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
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

  const sortOptions = [
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' }
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.find(cat => cat._id === category._id)
        ? prev.filter(cat => cat._id !== category._id)
        : [...prev, category]
    );
    setPage(1);
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRanges(prev =>
      prev.find(r => r.min === range.min && r.max === range.max)
        ? []
        : [range]
    );
    setPage(1);
  };

  const handleSortChange = (sort) => {
    setSelectedSorts(prev => {
      const sortExists = prev.some(s => s === sort.value);
      if (sortExists) {
        return prev.filter(s => s !== sort.value);
      }
      return [...prev, sort.value];
    });
    setPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => {
      const typeExists = prev.some(t => t._id === type._id);
      if (typeExists) {
        return prev.filter(t => t._id !== type._id);
      }
      return [...prev, type];
    });
    setPage(1);
  };

  const loadFilteredProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Handle category filters
      if (selectedCategories.length > 0) {
        // Get all type IDs from selected categories
        const selectedTypeIds = new Set();
        selectedCategories.forEach(category => {
          category.clothing_type.forEach(type => {
            selectedTypeIds.add(type._id);
          });
        });

        // Add category IDs to params
        selectedCategories.forEach(category => 
          params.append('categoryType', category._id)
        );
      }

      // Handle type filters
      if (selectedTypes.length > 0) {
        selectedTypes.forEach(type => 
          params.append('typeId', type._id)
        );
      }

      // Handle sorting
      if (selectedSorts.length > 0) {
        selectedSorts.forEach(sort => 
          params.append('sortFields', sort)
        );
      }
      
      // Handle price range filters
      if (selectedPriceRanges.length > 0) {
        const range = selectedPriceRanges[0];
        if (range.min) params.append('minPrice', range.min);
        if (range.max) params.append('maxPrice', range.max);
      }
      
      // Add pagination parameters
      params.append('page', page);
      params.append('limit', limit);

      console.log('Request params:', params.toString());
      const response = await axios.get(`http://localhost:8000/api/product?${params}`);
      console.log('Response:', response.data);
      
      if (response.data.success) {
        const products = response.data.data;
        setProductList(prev => page === 1 ? products : [...prev, ...products]);
        setTotal(response.data.pagination.total);
        setTotalPages(response.data.pagination.pages);

        if (products.length === 0 && page === 1) {
          toast.info('No products found for the selected filters');
        }
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading filtered products:', error);
      toast.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSorts([]);
    setPage(1);
  };

  useEffect(() => {
    const fetchCategoriesAndTypes = async () => {
      try {
        // Fetch categories
        const categoryResponse = await axios.get('http://localhost:8000/api/category');
        if (categoryResponse.data.success) {
          console.log('Raw categories:', categoryResponse.data.data);

          // First, normalize category titles to ensure consistent comparison
          const normalizedCategories = categoryResponse.data.data.map(cat => ({
            ...cat,
            title: cat.title.trim().toLowerCase()
          }));

          // Group categories by normalized title
          const categoriesMap = {};
          normalizedCategories.forEach(category => {
            const title = category.title;
            if (!categoriesMap[title]) {
              categoriesMap[title] = {
                ...category,
                title: category.title.trim(), // Keep original case for display
                clothing_type: [...category.clothing_type]
              };
            } else {
              // Merge clothing types
              category.clothing_type.forEach(type => {
                if (!categoriesMap[title].clothing_type.some(t => t._id === type._id)) {
                  categoriesMap[title].clothing_type.push(type);
                }
              });
            }
          });

          const uniqueCategories = Object.values(categoriesMap);
          console.log('Unique categories:', uniqueCategories);
          setAvailableCategories(uniqueCategories);

          // Fetch and deduplicate types
          const typeResponse = await axios.get('http://localhost:8000/api/type');
          if (typeResponse.data.success) {
            console.log('Raw types:', typeResponse.data.data);
            const typesMap = {};
            typeResponse.data.data.forEach(type => {
              const title = type.title.trim().toLowerCase();
              if (!typesMap[title]) {
                typesMap[title] = {
                  ...type,
                  title: type.title.trim() // Keep original case for display
                };
              }
            });
            const uniqueTypes = Object.values(typesMap);
            console.log('Unique types:', uniqueTypes);
            setAvailableTypes(uniqueTypes);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load filters');
      }
    };

    fetchCategoriesAndTypes();
    checkLogin();
  }, []);

  useEffect(() => {
    console.log('Current available categories:', availableCategories);
  }, [availableCategories]);

  useEffect(() => {
    loadFilteredProducts();
  }, [page, selectedCategories, selectedTypes, selectedPriceRanges, selectedSorts]);

  const lastProductRef = useCallback(node => {
    if (loading || !node) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && page < totalPages) {
        setPage(prev => prev + 1);
      }
    });
    observer.current.observe(node);
  }, [loading, page, totalPages]);

  const checkLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/auth');
      setUserLoggedIn(response.data.success);
    } catch {
      setUserLoggedIn(false);
    }
  };

  const addToCart = async (productId) => {
    if (!userLoggedIn) {
      toast.error('Please log in first!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/cart/add', {
        productId,
        quantity: 1
      });
      if (response.data.success) {
        toast.success('Product added to cart!');
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding product to cart');
    }
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
            {availableCategories
              .sort((a, b) => a.title.localeCompare(b.title))
              .map(category => (
                <label key={category._id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.some(cat => cat._id === category._id)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category.title}</span>
                </label>
              ))}
          </div>

          <div className="filter-section">
            <h3>Type</h3>
            {availableTypes
              .sort((a, b) => a.title.localeCompare(b.title))
              .map(type => (
                <label key={type._id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTypes.some(t => t._id === type._id)}
                    onChange={() => handleTypeChange(type)}
                  />
                  <span>{type.title}</span>
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
            <h3>Sort By</h3>
            {sortOptions.map(sort => (
              <label key={sort.value} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSorts.includes(sort.value)}
                  onChange={() => handleSortChange(sort)}
                />
                <span>{sort.label}</span>
              </label>
            ))}
          </div>

          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
            disabled={!selectedCategories.length && !selectedTypes.length && !selectedPriceRanges.length && !selectedSorts.length}
          >
            Clear All Filters
          </button>
        </div>

        <div className="store-content">
          {loading && page === 1 ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="store-grid">
              {productList.length === 0 ? (
                <div className="no-products">
                  <p>No products available for the selected filters.</p>
                </div>
              ) : (
                productList.map((product, index) => (
                  <div 
                    key={product._id}
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
                      <p className="product-category">
                        {product.category.map(cat => cat.title).join(', ')}
                      </p>
                      <p className="product-description">{product.description}</p>
                      <p className="product-price">Price: ${product.price.toLocaleString()}</p>
                    </div>
                    <div className="product-controls">
                      <button
                        onClick={() => addToCart(product._id)}
                        className="prime-button"
                        disabled={!userLoggedIn}
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
              {loading && page > 1 && (
                <div className="loading">Loading more products...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;