import React, { useState, useEffect } from 'react';
import { fetchDataN } from '../../admin/utils/crudUtils';
import toast from 'react-hot-toast';
import './styles/Shared.css';
import { MdStarRate } from 'react-icons/md';
import axios from 'axios';
import ConfirmModal from '../components/ConfirmModal';
import { CSSTransition } from 'react-transition-group';

// import { MdStarRate } from "react-icons/md";

const Store = () => {
  const [reviewProduct, setReviewProduct] = useState(null)
  const [reviewModal, setReviewModal] = useState(false)
  const [productInfo, setProductInfo] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [productList, setProductList] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    price: [],
    rating: [],
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
      if (filters.category.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          product.category.some((cat) => filters.category.includes(cat.title))
        );
      }
  
      // Filter by Price
      if (filters.price.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          return filters.price.some((range) => {
            const [min, max] = range.split('-').map(Number);
            return product.price >= min && product.price <= max;
          });
        });
      }
  
      // Filter by Rating (exact match)
      if (filters.rating.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          const avgRating =
            product.reviews?.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length || 0;
  
          // Check if the average rating matches exactly the selected rating
          return filters.rating.some((rating) => avgRating === Number(rating));
        });
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

  useEffect(() => {
    if (userLoggedIn) {
      const fetchUserProducts = async () => {
        const updatedProductList = await Promise.all(
          productList.map(async (product) => {
            const userHasProduct = await checkUserOrders(product._id);
            return {
              ...product,
              userHasProduct,
            };
          })
        );

        setProductList(updatedProductList);
      };

      fetchUserProducts();
    }
  }, [userLoggedIn])

  const checkUserOrders = async (productId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/product/check/${productId}/${userId}/`)
      // console.log(res)
      const userHasProduct = res.data.success
      return userHasProduct
      // console.log(userHasProduct)
    } catch (e) {
      console.log(e)
    }
  }

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
    const { name, value, checked } = e.target;

    setFilters((prevFilters) => {
      const newFilter = checked
        ? [...prevFilters[name], value]
        : prevFilters[name].filter((item) => item !== value);
      return { ...prevFilters, [name]: newFilter };
    });
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      price: [],
      rating: [],
      sortBy: '',
    });
  };

  return (
    <div className="store-page">
      <div className="store-header">
        <h1>Our Products</h1>
        <p>Explore our collection and find your perfect style!</p>
      </div>

      <div className="store-container">
        <div className="filters">
          <h3>Filter by Category</h3>
          {productList
            .flatMap((product) => product.category)
            .filter((cat, index, self) => index === self.findIndex((c) => c.title === cat.title))
            .map((cat) => (
              <div key={cat._id}>
                <label>
                  <input
                    type="checkbox"
                    name="category"
                    value={cat.title}
                    onChange={handleFilterChange}
                  />
                  {cat.title}
                </label>
              </div>
            ))}

          <h3>Filter by Price</h3>
          {['1-1000', '1000-5000', '5000-10000', '10000-100000'].map((range) => (
            <div key={range}>
              <label>
                <input
                  type="checkbox"
                  name="price"
                  value={range}
                  onChange={handleFilterChange}
                />
                {`$${range.replace('-', ' - $')}`}
              </label>
            </div>
          ))}

          <h3>Filter by Rating</h3>
          {[1, 2, 3, 4, 5].map((rating) => (
            <div key={rating}>
              <label>
                <input
                  type="checkbox"
                  name="rating"
                  value={rating}
                  onChange={handleFilterChange}
                />
                {`${rating} Star${rating > 1 ? 's' : ''}`}
              </label>
            </div>
          ))}

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
                      src={product.images[0]?.url || 'https://placehold.co/200x300'}
                      alt={product.title}
                    />
                  </div>
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <p className="product-category">
                      {product.category[0]?.title || 'Uncategorized'}
                    </p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">Price: ${product.price}</p>
                  </div>
                  <div className="product-controls">
                    <button onClick={() => addToCart(product._id)} className="prime-button">
                      Add to Cart
                    </button>
                    {product.userHasProduct ? (
                          <button className="rate" onClick={() => {
                            setReviewModal(true)
                            setReviewProduct(product._id)
                          }}><MdStarRate /></button>
                        ) : (
                          <></>
                        )}
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
      </div>

      <CSSTransition in={openModal} timeout={300} classNames="modal" unmountOnExit>
        <ConfirmModal setModalOpen={setOpenModal} productInfo={productInfo} />
      </CSSTransition>
    </div>
  );
};


const Review = ({ setModalOpen, userId, productId }) => {
  const [review, setReview] = useState(null)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [formState, setFormState] = useState({
    'rating': '',
    'review': ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }));
    console.log(formState)
  };

  const closeModals = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    checkIfUserReviewed()
  }, [])

  const checkIfUserReviewed = async () => {
    const res = await axios.get(`http://localhost:8000/api/product/checkReviews/${productId}/${userId}/`)
    if (res.data.success == false) {
      setHasReviewed(true)
      setReview(res.data.review)
      setFormState({
        'rating': res.data.review.rating,
        'review': res.data.review.review
      })
      // console.log(res.data)
    }
  }

  useEffect(() => {
    console.log(review)
  }, [review])

  const postReview = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/product/review/${productId}/${userId}/`, formState)
      console.log(res)
      toast.success('Review Posted!')
      setModalOpen(false)
    } catch (e) {
      console.log(e)
      toast.error("Review unsuccesful.")
    }
  }

  const updateReview = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/product/updateReview/${productId}/${userId}/`, formState)
      console.log(res)
      toast.success('Review Updated!')
      setModalOpen(false)
    } catch (e) {
      console.log(e)
      toast.error("Update unsuccesful.")
    }
  }

  const deleteReview = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/product/delete/${productId}/${userId}/`)
      console.log(res)
      toast.success('Review Deleted!')
      setModalOpen(false)
    } catch (e) {
      console.log(e)
      toast.error("Delete unsuccesful.")
    }
  }

  return (
    <>
      <div
        className='modal-background'
        onClick={() => {
          closeModals();
        }}
      >
        {
          hasReviewed ? (
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
              <TextField
                id="outlined-basic"
                label="User"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                value={userId}
              />
              <TextField
                id="outlined-basic"
                label="Rating"
                variant="outlined"
                name="rating"
                onChange={handleChange}
                value={formState.rating}
              />
              <div className="review-field">
                <Textarea
                  minRows={2}
                  placeholder="Write your review..."
                  size="lg"
                  variant="outlined"
                  name="review"
                  onChange={handleChange}
                  value={formState.review}
                />
              </div>
              <div className="review-controls">
                <button onClick={updateReview} className="prime-button">Post Review</button>
                <button onClick={deleteReview} className="prime-button delete-button">Delete Review</button>
              </div>
            </div>
          ) : (
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
              <TextField
                id="outlined-basic"
                label="User"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                value={userId}
              />
              <TextField
                id="outlined-basic"
                label="Rating"
                variant="outlined"
                name="rating"
                onChange={handleChange}
                value={formState.rating}
              />
              <div className="review-field">
                <Textarea
                  minRows={2}
                  placeholder="Write your review..."
                  size="lg"
                  variant="outlined"
                  name="review"
                  onChange={handleChange}
                  value={formState.review}
                />
              </div>
              <div className="review-controls">
                <button onClick={postReview} className="prime-button">Post Review</button>
              </div>
            </div>
          )
        }
      </div >

      <CSSTransition
          in={reviewModal}
          timeout={300}
          classNames="modal"
          unmountOnExit
        >
          <Review setModalOpen={setReviewModal} userId={userId} productId={reviewProduct} />
        </CSSTransition>
    </>
  )
}

export default Store;