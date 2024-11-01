import React, { useState, useEffect } from 'react';
import './styles/Cart.css';
import axios from 'axios';

const Cart = () => {
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState([]);
  const [counters, setCounters] = useState([]);
  const [checkoutInfo, setCheckoutInfo] = useState({})

  const retrieveCart = async (id) => {
    let tempList = [];
    try {
      const result = await axios.get(`http://localhost:8000/api/user/${id}`);
      const cart = result.data.data.cart || [];
      cart.forEach((cartItem) => {
        console.log("cartItem", cartItem)
        tempList.push({
          cartItemId: cartItem._id,
          productId: cartItem.productId._id,
          stockId: cartItem.stockId,
          name: cartItem.productId.title,
          price: cartItem.productId.price,
          color: cartItem.color,
          size: cartItem.size,
          quantity: cartItem.quantity
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

  const handleCheckout = async () => {
    try {
      // console.log(checkoutInfo)
      const result = await axios.post(`http://localhost:8000/api/user/${userId}/checkout`, checkoutInfo)
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  const confirmItems = () => {
    setCheckoutInfo({
      items: items,
      status: 'Pending',
      datePlaced: new Date()
    })
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
                <input className="cart-check" type="checkbox" />
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
        <div className="d-flex">
          <button onClick={handleCheckout} className='prime-button'>Submit</button>
          <button onClick={confirmItems} className='prime-button'>Confirm Items</button>
        </div></>
        )}
          
        </div>
      </div>
      <div className="side">

      </div>
    </section>
  );
};

export default Cart;
