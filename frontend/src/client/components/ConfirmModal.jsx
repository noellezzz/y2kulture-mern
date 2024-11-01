import React, { useState, useEffect } from 'react';
import './styles/Modal.css';
import axios from 'axios'

const ConfirmModal = ({ setModalOpen, productInfo }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [stockQuantity, setStockQuantity] = useState(null)
    const [stockId, setStockId] = useState(null)
    const [productId, setProductId] = useState(null)
    const [userId, setUserId] = useState(null)

    const colors = [];
    const sizes = [];
    const combos = new Set(); 

    const checkLogin = async (request, response) => {
        try {
          const response = await axios.get('http://localhost:8000/auth')
        //   setUserLoggedIn(true)
          setUserId(response.data.user._id)
        } catch {
        //   setUserLoggedIn(false)
        }
      }

    useEffect(() => {
        checkLogin()
    }, [])

    if (Array.isArray(productInfo.stock) && productInfo.stock.length !== 0) {
        productInfo.stock.forEach(item => {
            if (!colors.includes(item.color)) colors.push(item.color); 
            if (!sizes.includes(item.size)) sizes.push(item.size); 

            combos.add(`${item.color}-${item.size}`);
        });
    }

    const selectColor = (color) => {
        setSelectedColor(color);
        setSelectedSize(null)
        setStockQuantity(0)
        setStockId(null)
    };

    const selectSize = (size) => {
        setSelectedSize(size);
        const matchedItem = productInfo.stock.find(
            item => item.color === selectedColor && item.size === size
        );

        if (matchedItem) {
            setStockQuantity(matchedItem.quantity)
            setStockId(matchedItem._id)
            setProductId(productInfo._id)
            // console.log(`Selected Combo: Color - ${selectedColor}, Size - ${size}, Quantity - ${matchedItem._id}`);
        }
    };

    const addToCart = async() => {
        // console.log(userId)
        let cartInfo = {
          stockId: stockId,
          productId: productId,
          quantity: 1,
          color: selectedColor,
          size: selectedSize
        };
        console.log(cartInfo)
        try {
          const result = await axios.post(`http://localhost:8000/api/user/addToCart/${userId}`, cartInfo)
          console.log(result)
          setModalOpen(false)
        } catch(e) {
          console.log("Error adding to cart", e)
        }
      }

    return (
        <div onClick={() => { setModalOpen(false); }} className="modal-background">
            <div onClick={(e) => e.stopPropagation()} className="landscape">
                <div className="modal-body">
                    <div className="img-container">
                        <img src="https://placehold.co/400x600" alt="" />
                    </div>
                    <div className="modal-content">
                        <div className="title">{productInfo.title}</div>
                        <div className="category-stock">
                            <div>{productInfo.category[0].title}</div>
                            <div>{stockQuantity} in stock</div>
                        </div>
                        <div className="color">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className={`toggle-button ${selectedColor === color ? 'active' : ''}`}
                                    onClick={() => selectColor(color)}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                        <div className="size">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`toggle-button ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => selectSize(size)}
                                    disabled={!combos.has(`${selectedColor}-${size}`)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <div className="controls">
                            <div className="prime-button" onClick={() => setModalOpen(false)}>Close</div>
                            <div className="prime-button" onClick={addToCart}>Confirm</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
