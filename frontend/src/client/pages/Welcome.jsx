import React, { useState, useEffect, useRef } from 'react'
import './styles/Shared.css'
import heroImage from '../../assets/heroimage.png'
import { fetchData } from '../../admin/utils/crudUtils'
import Cookies from 'js-cookie';
import axios from 'axios'
import ConfirmModal from '../components/ConfirmModal';
import { CSSTransition } from 'react-transition-group';
import { fetchDataN } from '../../admin/utils/crudUtils';
import toast from 'react-hot-toast';
import { FaFacebookSquare, FaInstagram, FaTwitterSquare } from "react-icons/fa";
import './styles/BlobButton.css'
import jeans from '../../assets/jeans.png'
import tshirt from '../../assets/tshirt.png'
import boots from '../../assets/boots.png'
import { MdStarRate } from "react-icons/md";
import TextField from '@mui/material/TextField';
import Textarea from '@mui/joy/Textarea';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

import { Filter } from 'bad-words';

import { useAuth } from '../../AuthContext';

const Welcome = () => {
  const { isAuthenticated, user } = useAuth();
  const [reviewProduct, setReviewProduct] = useState(null)
  const [reviewModal, setReviewModal] = useState(false)
  const [userId, setUserId] = useState('')
  const [productInfo, setProductInfo] = useState([])
  // const [cartInfo, setCartInfo] = useState({})
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchProducts = async (currentPage) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8000/api/product?page=${currentPage}&limit=6`);
      const { data, pagination } = response.data;
      const updatedProductList = await Promise.all(
        data.map(async (product) => {
          const userHasProduct = await checkUserOrders(product._id, user._id);
          return {
            ...product,
            userHasProduct,
          };
        })
      );
      setProductList((prev) => [...prev, ...updatedProductList]);
      setHasMore(currentPage < pagination.pages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const lastProductRef = useRef();

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      fetchProducts(page);
    }, 1000);
    setLoading(false)
  }, [page]);

  useEffect(() => {
    const options = { root: null, rootMargin: '0px', threshold: 1.0 };
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }, options);

    if (lastProductRef.current) {
      observer.current.observe(lastProductRef.current);
    }

    return () => {
      if (observer.current && lastProductRef.current) {
        observer.current.unobserve(lastProductRef.current);
      }
    };
  }, [lastProductRef, hasMore, loading]);

  const checkUserOrders = async (productId, user) => {
    try {
      console.log(user)
      const res = await axios.post(`http://localhost:8000/api/product/check/${productId}/${user}`)
      // console.log(res)
      const userHasProduct = res.data.success
      return userHasProduct
      // console.log(userHasProduct)
    } catch (e) {
      console.log(e)
    }
  }

  const addToCart = async (productId) => {
    if (!user._id) {
      toast.error('Please Log In First!');
      return
    }
    const result = await fetchDataN('product', productId)
    setProductInfo(result.data.data)
    setOpenModal(true)
  }

  return (
    <>
      <section className="hero-section">
        <div className="content-container dual-main__content">
          <div className="hero-tagline dual-main__container">
            <div className="hero-icons">
              <FaFacebookSquare />
              <FaInstagram />
              <FaTwitterSquare />
            </div>
            <div className="tagline-title">
              <span className="highlight">Y2Kulture:</span>
            </div>
            <div className="tagline-body">
              A Haven for Y2k and Retro Fashionistas
            </div>
            <div className="hero-controls">
              <div class="wrapper">
                <a class="cta" href="#">
                  <span className='skeww'>Shop Now</span>
                  <span className='skeww'>
                    <svg width="26px" height="16px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <g id="arrow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path class="one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                        <path class="two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                        <path class="three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF"></path>
                      </g>
                    </svg>
                  </span>
                </a>
              </div>
              {/* <button>Learn More</button> */}
            </div>
          </div>
          <div className="hero-images">
            <div className="hover-tiles product-one">
              <div className="hover-img__container">
                <img src={jeans} alt="" />
              </div>
              <h5>Straight-fit Jeans</h5>
              <h5 className='emph'>$ 20.00</h5>
            </div>
            <div className="hover-tiles product-two">
              <div className="hover-img__container">
                <img src={tshirt} alt="" />
              </div>
              <h5>Crop Top</h5>
              <h5 className='emph'>$ 20.00</h5>
            </div>
            <div className="hover-tiles product-three">
              <div className="hover-img__container">
                <img src={boots} alt="" />
              </div>
              <h5>Shifty Boots</h5>
              <h5 className='emph'>$ 20.00</h5>
            </div>
            <div className="square-one"></div>
            <div className="square-two"></div>
            <img src={heroImage} alt="" />
          </div>
        </div>
      </section>
      <section className='light-section'>
        <div className="section-header">
          <div className="section-texts">
            <div className="section-header__title">Top Grossing Products</div>
            <div className="section-sub__header">Discover your unique style today!</div>
          </div>
          <div className="section-categories">
            <button className="prime-button">Men's Wear</button>
            <button className="prime-button">Women's Wear</button>
            <button className="prime-button">Trending</button>
          </div>
        </div>
        <div className="store-primary">
          {productList.map((product, index) => (
            <div
              key={index}
              ref={index === productList.length - 1 ? lastProductRef : null}
              className="product-tile__primary"
            >
              {/* Render Product Info */}
              <div className="tile-img__container">
                <img src="https://placehold.co/200x800" alt={product.title} />
              </div>
              <div className="tile-body__container">
                <div className="product-title">{product.title}</div>
                <div className="product-category">{product.category[0].title}</div>
                <div className="product-price">Price: ${product.price}</div>
                <div className="tile-controls">
                  <div className="product-price">Price: ${product.price}</div>
                  <button onClick={() => { addToCart(product._id) }} className="prime-button tile-button">Add to Cart</button>
                  {product.userHasProduct ? (
                    <button className="rate" onClick={() => {
                      setReviewModal(true)
                      setReviewProduct(product._id)
                    }}><MdStarRate /></button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

            </div>
          ))}
          {hasMore && <Box sx={{
            display: 'flex',
            flexDirection: 'row', // Align children in a row
            gap: 2, // Add spacing between children
            alignItems: 'center',
          }}>
            <Skeleton variant="rounded" width={437} height={280} />
            <Skeleton variant="rounded" width={437} height={280} />
            <Skeleton variant="rounded" width={437} height={280} />
          </Box>}

        </div>
        <CSSTransition
          in={openModal}
          timeout={300}
          classNames="modal"
          unmountOnExit
        >
          <ConfirmModal setModalOpen={setOpenModal} productInfo={productInfo} />
        </CSSTransition>

        <CSSTransition
          in={reviewModal}
          timeout={300}
          classNames="modal"
          unmountOnExit
        >
          <Review setModalOpen={setReviewModal} userId={user._id} productId={reviewProduct} />
        </CSSTransition>
      </section>
    </>

  )
}

const Review = ({ setModalOpen, userId, productId }) => {
  const [review, setReview] = useState(null)
  const filter = new Filter();
  const [hasReviewed, setHasReviewed] = useState(false)
  const [formState, setFormState] = useState({
    'rating': '',
    'review': ''
  })

  const handleInputChange = (e) => {
    // console.log(e.target.value)
    const cleanReview = filter.clean(e.target.value);
    setFormState((prevState) => ({
      ...prevState,
      [review]: cleanReview
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }));
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


  const postReview = async () => {
    try {
      const cleanReview = filter.clean(formState.review);
      console.log(cleanReview)
      setFormState((prevState) => ({
        ...prevState,
        [review]: cleanReview
      }));

      const formData = {
        'rating': formState.rating,
        'review': cleanReview
      }
      console.log(formState)
      const res = await axios.post(`http://localhost:8000/api/product/review/${productId}/${userId}/`, formData)
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
      const cleanReview = filter.clean(formState.review);
      console.log(cleanReview)
      setFormState((prevState) => ({
        ...prevState,
        [review]: cleanReview
      }));

      const formData = {
        'rating': formState.rating,
        'review': cleanReview
      }
      const res = await axios.post(`http://localhost:8000/api/product/updateReview/${productId}/${userId}/`, formData)
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
    </>
  )
}

export default Welcome