import React, { useState } from 'react'
import './styles/Cart.css'


const Cart = () => {
  const items = [
    { name: 'Item 1', price: '9.99', color: 'Black', size: 'Medium' },
    { name: 'Item 2', price: '14.99', color: 'Red', size: 'Small' },
    { name: 'Item 3', price: '19.99', color: 'Blue', size: 'Large' },
    { name: 'Item 4', price: '29.99', color: 'Green', size: 'Extra Large' },
  ];
  const [counters, setCounters] = useState(Array(items.length).fill(0)); // Initialize counters to 0
  console.log(items.length)
  const handleAdd = (index) => {
    const newCounters = [...counters];
    newCounters[index] += 1; // Increase the specific counter by 1
    setCounters(newCounters);
  };

  const handleMinus = (index) => {
    const newCounters = [...counters];
    if (newCounters[index] > 0) {
      newCounters[index] -= 1; // Decrease the specific counter by 1 if greater than 0
    }
    setCounters(newCounters);
  };

  return (
    <section className='main-side__container'>
      <div className="main">
        <div className="section-title">Shopping Cart</div>
        <div className="quick-info">{items.length} items in your bag</div>

        <div className="cart-container">
          <div className="cart-header">
            <div className="checkbox">Item</div>
            <div className="product">Product</div>
            <div className="quantity">Quantity</div>
            <div className="price">Price</div>
          </div>
          <div className="cart-list">
            {items.map((item, index) => (
              <div className="cart-item" key={index}>
                <div className="checkbox d-center">
                  <input className="cart-check" type="checkbox" name="" id="" />
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
                  <span>${item.price}</span> {/* Display the price */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="side">

      </div>
    </section>
  )
}

export default Cart