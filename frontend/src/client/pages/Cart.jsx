import React, { useState, useEffect } from 'react';
import './styles/Cart.css';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';
import { CSSTransition } from 'react-transition-group';

const Cart = () => {
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState([]);
  const [counters, setCounters] = useState([]);
  const [checkoutInfo, setCheckoutInfo] = useState({})
  const [total, setTotal] = useState(0.00)
  const [discount, setDiscount] = useState(0)
  const [discountedPrice, setDiscountedPrice] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [addData, setAddData] = useState({
    promoCode: '',
    address: ''
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAddData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheck = (id) => {
    // console.log("Before toggle:", items);
    setItems((prevItems) => {
      const updatedItems = prevItems.map((cartItem) =>
        cartItem.cartItemId === id ? { ...cartItem, checked: !cartItem.checked } : cartItem
      );
      // console.log("After toggle:", updatedItems);
      return updatedItems;
    });


  };

  const calculateTotal = () => {
    if (Array.isArray(items) && items.length > 0) {
      let newTotal = items.reduce((accumulator, item) => {
        return item.checked ? accumulator + (item.price * item.quantity) : accumulator;
      }, 0);
      console.log(newTotal)
      newTotal = newTotal - (newTotal * discount)
      setTotal(newTotal);
      setDiscountedPrice((newTotal * discount));
    } else {
      setTotal(0);
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [items]);

  useEffect(() => {
    calculateTotal();
  }, [discount]);

  const findPromo = async () => {
    try {
      const result = await axios.post(`http://localhost:8000/api/promo/find/withcode`, addData)
      toast.success(result.data.message)
      setDiscount(result.data.promo.discount)
      console.log(result)
    } catch (e) {
      console.log("Eror in finding promo", e)
    }
  }

  const retrieveCart = async (id) => {
    let tempList = [];
    try {
      const result = await axios.get(`http://localhost:8000/api/user/${id}`);
      const cart = result.data.data.cart || [];
      cart.forEach((cartItem) => {
        if (!cartItem.productId) {
          console.log(`Skipping cart item with missing productId: ${cartItem._id}`);
          return; // Skip this item if productId is null or undefined
        }
  
        tempList.push({
          cartItemId: cartItem._id,
          productId: cartItem.productId._id,
          name: cartItem.productId.title,
          price: cartItem.productId.price,
          stockId: cartItem.stockId,
          color: cartItem.color,
          size: cartItem.size,
          quantity: cartItem.quantity,
          checked: false
        });
      });
      setItems(tempList);
      setCounters(tempList.map(item => item.quantity));
    } catch (error) {
      console.log(`Error while fetching Data`, error);
    }
  };
  

  const handleAdd = (index) => {
    const newCounters = [...counters];
    const newItems = [...items];

    newCounters[index] += 1;
    newItems[index].quantity += 1;

    setCounters(newCounters);
    setItems(newItems);
  };

  const handleMinus = (index) => {
    const newCounters = [...counters];
    const newItems = [...items];

    if (newCounters[index] > 0) {
      newCounters[index] -= 1;
      newItems[index].quantity -= 1;
    }

    setCounters(newCounters);
    setItems(newItems);
  };

  const checkLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/auth');
      setUserId(response.data.user._id);
      retrieveCart(response.data.user._id);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const confirmItems = () => {
    if (addData.address == '') {
      toast.error('Please fill out Address')
    } else if (items.every(item => !item.checked)) {
      toast.error('No Product added for Checkout.')
    }
    else {
      let checkedItems = []
      items.map((item) => {
        if (item.checked) {
          checkedItems.push(item)
        }
      })
      // console.log(checkedItems)
      setOpenModal(true)
      setCheckoutInfo({
        total_cost: total,
        shippingDetails: addData.address,
        promoCode: addData.promoCode,
        items: checkedItems,
        status: 'Pending',
        datePlaced: new Date()
      })
    }

  }

  return (
    <section className='main-side__container'>
      <div className="main">
        <div className="section-title">Shopping Cart</div>
        <div className="quick-info">{items.length} items in your bag</div>
        <div className="cart-container">
          {items.length < 1 ? (
            <div>No Items Added to Cart</div>
          ) : (
            <><div className="cart-header">
              <div className="checkbox">Item</div>
              <div className="product">Product</div>
              <div className="quantity">Quantity</div>
              <div className="price">Subtotal</div>
            </div>
              <div className="cart-list">
                {items.map((item, index) => (
                  <div className="cart-item" key={index}>
                    <div className="checkbox d-center">
                      <input
                        name="checked"
                        onChange={() => handleCheck(item.cartItemId)}
                        checked={item.checked}
                        className="cart-check"
                        type="checkbox"
                      />
                    </div>
                    <div className="product">
                      <div className="product-img">
                        <img src="https://placehold.co/400x400" alt="" />
                      </div>
                      <div className="product-info">
                        <div className="category-holder">Sample Category</div>
                        <div className="title-holder">{item.name}</div>
                        <div className="color-holder">Color: <span className="pale-text">{item.color}</span></div>
                        <div className="size-holder">Size: <span className="pale-text">{item.size}</span></div>
                      </div>
                    </div>
                    <div className="quantity">
                      <button className='prime-button' onClick={() => handleMinus(index)} style={{ margin: '5px' }}>-</button>
                      <span>{counters[index]}</span>
                      <button className='prime-button' onClick={() => handleAdd(index)} style={{ margin: '5px' }}>+</button>
                    </div>
                    <div className="price">
                      <span>${item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex align-center">
                <div className="total">$ {total} <span>(Discount: $ {discountedPrice})</span></div>
                {/* <button onClick={handleCheckout} className='prime-button'>Submit</button> */}
                <button onClick={confirmItems} className='prime-button'>Confirm Items</button>
              </div></>
          )}

        </div>
      </div>
      <div className="side">
        <div className="side-container__title">
          Additional Details
        </div>
        <div className="side-container">
          <div className="additional-fields">
            <TextField
              name="address"
              onChange={handleOnChange}
              value={addData.address}
              id="outlined-basic"
              label="Address"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary-color)',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: 'var(--primary-color)',
                  },
                },
              }}
            />
          </div>
          <div className="additional-fields">
            <TextField
              name="promoCode"
              onChange={handleOnChange}
              value={addData.promoCode}
              id="outlined-basic"
              label="Promo Code"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary-color)',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: 'var(--primary-color)',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'var(--primary-color)',

              }}
              onClick={findPromo}
            >Check</Button>
          </div>
        </div>
      </div>

      <CSSTransition
          in={openModal}
          timeout={300}
          classNames="modal"
          unmountOnExit
        >
          <ConfirmationModal setOpenModal={setOpenModal} checkoutInfo={checkoutInfo} userId={userId}/>
        </CSSTransition>
    </section>
  );
};

const ConfirmationModal = ({setOpenModal, checkoutInfo, userId}) => {

  const handleCheckout = async () => {
    try {
      const result = await axios.post(`http://localhost:8000/api/user/${userId}/checkout`, checkoutInfo)
      toast.success("Order Placed.")
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div onClick={() => { setOpenModal(false); }} className="modal-background">
      <div onClick={(e) => e.stopPropagation()} className="confirmation-modal">
        <button onClick={handleCheckout} className="prime-button">Confirm Order?</button>
      </div>  
    </div>
  )
}

export default Cart;
