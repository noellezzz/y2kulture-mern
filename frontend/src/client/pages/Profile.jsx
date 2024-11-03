import React, { useState, useEffect } from 'react'
import './styles/profile.css'
import { FaRegUser } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import axios from 'axios'

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '50px',
    '& fieldset': {
      borderColor: 'grey',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary-color)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'grey',
    '&.Mui-focused': {
      color: 'var(--primary-color)',
    },
  },
  height: '50px',
}));

const Profile = () => {
  const [contentPage, setContentPage] = useState('Account Overview')
  const checkLogin = async (request, response) => {
    try {
      const response = await axios.get('http://localhost:8000/auth')
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])

  return (
    <section className="profile-container">
      <div className="side">
        <div className="main-info">
          <div className="user-avatar__container">
            <img src="https://placehold.co/600x400" alt="" />
          </div>
          <div className="user-main__text">
            <h6 className='pale'>Welcome,</h6>
            <h4>John Doe</h4>
          </div>
        </div>

        <div className="profile-nav">
          <h5 className='pale spacer'>General Information</h5>
          <hr className='pale' />

          <div className="profile-nav__container">
            <button className="profile-nav__item" onClick={() => { setContentPage("Account Overview") }}><FaRegUser /> &nbsp; Profile Overview</button>
            <button className="profile-nav__item" onClick={() => { setContentPage("Orders") }}><MdOutlineShoppingBag /> &nbsp; Orders</button>
            <button className="profile-nav__item" onClick={() => { setContentPage("Purchase History") }}><MdOutlineShoppingBag /> &nbsp; Pruchase History</button>
          </div>
        </div>
      </div>
      <div className="profile-main">
        <div className="profile-title"><FaRegUser /> &nbsp; {contentPage}</div>
        {
          contentPage == 'Account Overview' ? (
            <AccountOverview />
          ) : contentPage == 'Orders' ? (
            <Orders />
          ) : (
            <AccountOverview />
          )
        }

      </div>
    </section>
  )
}

const AccountOverview = () => {
  return (
    <div className="profile-content">
      <div className='spacer'>Account Information</div>
      <hr />
      <div className="field-group">
        <div className="row">
          <StyledTextField label="Full Name" variant="outlined"
            InputProps={{
              readOnly: true,
            }} />
        </div>
        <div className="row">
          <StyledTextField label="First Name" variant="outlined" />
          <StyledTextField label="Last Name" variant="outlined" />
        </div>
        <div className="row">
          <StyledTextField label="Birthday" variant="outlined" />
          <StyledTextField label="Gender" variant="outlined" />
        </div>
      </div>
      <div className='spacer'>Delivery Information</div>
      <hr />
      <div className="field-group">
        <div className="row">
          <StyledTextField label="Address" variant="outlined"
            InputProps={{
              readOnly: true,
            }} />
        </div>
        <div className="row">
          <StyledTextField label="Street" variant="outlined" />
          <StyledTextField label="City" variant="outlined" />
          <StyledTextField label="State" variant="outlined" />
          <StyledTextField label="Country" variant="outlined" />
          <StyledTextField label="Zip Code" variant="outlined" />
        </div>
      </div>
    </div>
  )
}

const Orders = () => {
  const [orderList, setOrderList] = useState([])
  const [temporaryInfo, setTemporaryInfo] = useState({})
  const checkLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/auth');
      const tempList = response.data.user.checkout;
  
      if (Array.isArray(tempList) && tempList.length > 0) {
        const pendingOrders = await Promise.all(tempList.map(async (item) => {
          if (item.order.status === "Pending") {
            const tempItemsList = await Promise.all(item.order.items.map(async (product) => {
              const productInfo = await axios.get(`http://localhost:8000/api/product/${product.productId}`);
              return {
                quantity: product.quantity,
                color: product.color,
                size: product.size,
                title: productInfo.data.data.title,
                image: productInfo.data.data.images.length > 0 
                  ? productInfo.data.data.images[0].url 
                  : "https://placehold.co/600x400"
              };
            }));
  
            return {
              _id: item._id,
              datePlaced: item.order.datePlaced,
              totalCost: item.order.total_cost,
              items: tempItemsList,
            };
          }
        }));
  
        // Filter out undefined values
        const filteredOrders = pendingOrders.filter(order => order !== undefined);
        console.log("Pending orders:", filteredOrders);  // Log the pending orders
        setOrderList(filteredOrders);  // Set the order list with the complete data
      } else {
        console.log("No pending orders available.");
      }
    } catch (e) {
      console.error(e);
    }
  };
  

  const getInfo = async (id) => {
    try {
      const productInfo = await axios.get(`http://localhost:8000/api/product/${id}`)
      // console.log(productInfo.data)
      return productInfo.data
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])


  return (
    <div className="profile-content">
      <div className='spacer'>Pending Orders</div>
      <hr />
      {
        orderList.map((order, index) => {
          const date = new Date(order.datePlaced);
          const readableDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          });

          let tempArray = order.items;
          console.log(order.items)
          return (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <span className="primary-text">[{order._id}]</span> &nbsp; {readableDate}
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <strong>Total Cost:</strong> &nbsp;
                  $ {order.totalCost}
                </div>
                <br />
                {
                  Array.isArray(order.items) && order.items.length > 0 ? (  
                    order.items.map((item, index2) => (
                      <div key={index2} className="order-list">
                        <div className="order-img__container">
                          <img src={item.image} alt={item.title} /> 
                        </div>
                        <div className="order-title">{item.title}</div>
                        <div className="order-variant">Variant: {item.variant || 'N/A'}</div> 
                        <div className="order-quantity">Quantity: {item.quantity}</div> 
                      </div>
                    ))
                  ) : (
                    <div>No items found for this order.</div>  
                  )
                }
              </AccordionDetails>
            </Accordion>
          );
        })
      }
    </div>
  );
}

export default Profile