import React, { useEffect, useState } from 'react'
import { fetchData } from '../utils/crudUtils'
import axios from 'axios'
import '../styles/inventory.css'

const Inventory = () => {
    const [invData, setInvData] = useState([])
    const [stockList, setStockList] = useState([])
    const [selectedProduct, setSelectedProduct] = useState({
        productId: '',
        stockId: '',
        productName: '',
        color: '',
        size: '',
        status: '',
        quantity: '',
    });

    useEffect(() => {
        fetchData('product', setInvData)
    }, [])

    useEffect(() => {
        const tempList = []
        let productId = ''
        let productName = ''
        let status = 'In Stock'

        if (!(invData === undefined)) {
            invData.map((product) => {
                productId = product._id
                productName = product.title
                product.stock.map((stock) => {
                    if (stock.quantity < 10) {
                        status = 'Running Out'
                    }
                    if (stock.quantity == 0) {
                        status = 'Out of Stock'
                    }

                    if (stock.quantity > 10) {
                        status = 'In Stock'
                    }
                    tempList.push({ 'productId': productId, 'stockId': stock._id, 'productName': productName, 'color': stock.color, 'size': stock.size, 'quantity': stock.quantity, 'status': status })
                })
            })
        }
        // console.log(tempList)
        setStockList(tempList)
    }, [invData])

    const gatherInfo = (info) => {
        setSelectedProduct({
            productId: info.productId,
            stockId: info.stockId,
            productName: info.productName,
            color: info.color,
            size: info.size,
            status: info.status,
            quantity: info.quantity,
        });
    }

    const clearForm = () => {
        setSelectedProduct({
            productId: '',
            stockId: '',
            productName: '',
            color: '',
            size: '',
            status: '',
            quantity: '',
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async() => {
        try {
            const result = await axios.post(`http://localhost:8000/api/product/addStock/${selectedProduct.productId}`, selectedProduct)
            // Add visual feedback for success
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Stock updated successfully';
            document.querySelector('.sub-container__side').appendChild(successMessage);
            setTimeout(() => successMessage.remove(), 3000);
        } catch (e) {
            console.log("Error in submitting stock info", e)
            // Add visual feedback for error
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Failed to update stock';
            document.querySelector('.sub-container__side').appendChild(errorMessage);
            setTimeout(() => errorMessage.remove(), 3000);
        }
        clearForm()
    }

    

    return (
        <div className="main-container__admin">
            <div className="sub-container__double-semi">
                <div className="container-header">
                    <div className="title-holder">
                        <div className="title">Inventory Management</div>
                        <div className="context">Below is a list of Products and their current inventory information.</div>
                    </div>
                    <div className="search">
                        <input type="text" placeholder='Search' />
                    </div>
                </div>
                <div className="container-body">
                    <table className='custom-table'>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Stock ID</th>
                                <th>Title</th>
                                <th>Color</th>
                                <th>Size</th>
                                <th>Inventory Status</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                stockList.map((info, index) => {
                                    return (
                                        <tr onClick={() => {gatherInfo(info)}} key={index}>
                                            <td>{info.productId}</td>
                                            <td>{info.stockId}</td>
                                            <td>{info.productName}</td>
                                            <td>{info.color}</td>
                                            <td>{info.size}</td>
                                            <td>{info.status}</td>
                                            <td>{info.quantity}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="sub-container__side">
                <form onSubmit={() => {handleSubmit()}}>
                    <div className="input-group__b">
                        <label htmlFor="">Product ID</label>
                        <input value={selectedProduct.productId} onChange={handleInputChange} name="productId" type="text" />
                    </div>
                    <div className="input-group__b">
                        <label htmlFor="">Stock ID</label>
                        <input readonly value={selectedProduct.stockId} type="text" />
                    </div>
                    <div className="input-group__b">
                        <label htmlFor="">Product Name</label>
                        <input readonly value={selectedProduct.productName} type="text" />
                    </div>
                    <div className="input-group__b">
                        <label htmlFor="">Product Color</label>
                        <input  value={selectedProduct.color} onChange={handleInputChange} name="color" type="text" />
                    </div>
                    <div className="input-group__b">
                        <label htmlFor="">Product Size</label>
                        <input  value={selectedProduct.size} onChange={handleInputChange} name="size" type="text" />
                    </div>
                    <div className="input-group__b">
                        <label htmlFor="">In Stock</label>
                        <input value={selectedProduct.quantity} onChange={handleInputChange} name="quantity" type="text" />
                    </div>
                    <button type='button' onClick={() => {handleSubmit()}}>Save</button>
                    <button type="button" onClick={() => {clearForm()}}>Clear</button>
                </form>
            </div>
        </div>
    )
}

export default Inventory