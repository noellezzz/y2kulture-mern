import React, { useState, useEffect, useRef } from 'react'
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
import { createFunc, updateFunc } from '../../admin/utils/crudUtils';
import { ref, uploadBytes, getDownloadURL, getStorage  } from "firebase/storage";

const storage = getStorage();

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
  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("Uploading...")

    try {
      const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                  setAvatarUrl(reader.result)
                  changeProfileImg(reader.result)
                }
            }
            reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleImageClick = () => {
    console.log("Image clicked"); // Ensure this is logged
    fileInputRef.current.click(); // Trigger the file input click
};

  const [contentPage, setContentPage] = useState('Account Overview')
  const [userInfo, setUserInfo] = useState({})
  const [id, setId] = useState(null)

const changeProfileImg = async(image) => {
  try {
    const formSub = {
      avatar: [image]
    }
    const formUpload = await axios.put(`http://localhost:8000/api/user/${id}`, formSub)
    console.log(formUpload)
  } catch (error) {
    console.log(error)
  }
}

  const checkLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/auth')
      console.log("user", response.data.user.avatar)
      setUserInfo(response.data.user)
      setId(response.data.user._id)
      if (response.data.user.avatar && response.data.user.avatar.length > 0 ) {
        setAvatarUrl(response.data.user.avatar[0].url)
      } else {
        setAvatarUrl(`https://ui-avatars.com/api/?name=${response.data.user.first_name}+${response.data.user.last_name}&size=512`)
      }

    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])

  useEffect(() => {
    console.log(avatarUrl)
  }, [avatarUrl])

  return (
    <section className="profile-container">
      <div className="side">
        <div className="main-info">
          <div className="user-avatar__container" onClick={handleImageClick} >
          <input
                type="file"
                ref={fileInputRef} // Set the ref to the input
                onChange={handleAvatarUpload}
                style={{ display: 'none' }} // Hide the input
            />
                <img 
                    onClick={handleImageClick} 
                    className='user-img__actual' 
                    src={avatarUrl} 
                    alt={`User Avatar`} 
                />
          </div>
          <div className="user-main__text">
            <h6 className='pale'>Welcome,</h6>
            <h4>{userInfo.first_name} {userInfo.last_name}</h4>
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
  const [id, setId] = useState({ id: '' })
  const [userInfo, setUserInfo] = useState({
    email: '',
    first_name: '',
    last_name: '',
    gender: '',
    birthday: '',

    street: '',
    city: '',
    state: '',
    country: '',
    zip: ''
  });

  const checkLogin = async () => {
    try {
      const res = await axios.get('http://localhost:8000/auth')
      console.log("user", res.data.user.first_name)
      setId({ id: res.data.user._id })
      setUserInfo({
        email: res.data.user.email || '',
        first_name: res.data.user.first_name || '',
        last_name: res.data.user.last_name || '',
        gender: res.data.user.gender || '',
        birthday: res.data.user.birthday || '',

        street: res.data.user.address?.[0]?.street_address || '',
        city: res.data.user.address?.[0]?.city || '',
        state: res.data.user.address?.[0]?.state || '',
        country: res.data.user.address?.[0]?.country || '',
        zip: res.data.user.address?.[0]?.zip_code || ''
      })
      // setBasicInfo({ id: response.data.user._id })

    } catch (e) {
      console.log(e)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    checkLogin()
  }, [])

  useEffect(() => {
    console.log(userInfo)
  }, [userInfo])

  const handleSubmit = async () => {
    // console.log(userInfo)
    // e.preventDefault();
    try {
      await updateFunc('user', id.id, userInfo)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="profile-content">
      <div className='spacer'>Account Information</div>
      <hr />
      <div className="field-group">
        <div className="row">
          <StyledTextField label="Full Name" variant="outlined" value={userInfo.first_name + " " + userInfo.last_name}
            InputProps={{
              readOnly: true,
            }} />
        </div>
        <div className="row">
          <StyledTextField label="First Name" variant="outlined" value={userInfo.first_name} name="first_name" onChange={handleChange} />
          <StyledTextField label="Last Name" variant="outlined" value={userInfo.last_name} name="last_name" onChange={handleChange} />
        </div>
        <div className="row">
          <StyledTextField label="Birthday" variant="outlined" value={userInfo.birthday} name="birthday" onChange={handleChange} />
          <StyledTextField label="Gender" variant="outlined" value={userInfo.gender} name="gender" onChange={handleChange} />
        </div>
      </div>
      <div className='spacer'>Delivery Information</div>
      <hr />
      <div className="field-group">
        <div className="row">
          <StyledTextField label="Address" variant="outlined" value={userInfo.street + " " + userInfo.city + " " + userInfo.state + " " + userInfo.country + " " + userInfo.zip}
            InputProps={{
              readOnly: true,
            }} />
        </div>
        <div className="row">
          <StyledTextField label="Street" variant="outlined" value={userInfo.street} name="street" onChange={handleChange} />
          <StyledTextField label="City" variant="outlined" value={userInfo.city} name="city" onChange={handleChange} />
          <StyledTextField label="State" variant="outlined" value={userInfo.state} name="state" onChange={handleChange} />
          <StyledTextField label="Country" variant="outlined" value={userInfo.country} name="country" onChange={handleChange} />
          <StyledTextField label="Zip Code" variant="outlined" value={userInfo.zip} name="zip" onChange={handleChange} />
        </div>
      </div>
      <Button variant="contained"
        onClick={() => { handleSubmit() }}
      >Save Info
      </Button>
    </div>
  )
}

const Orders = () => {
  const [orderList, setOrderList] = useState([])
  const [temporaryInfo, setTemporaryInfo] = useState({})
  const checkIfExist = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/product/${id}`)
      if(response.data.success) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log(e)
    }
  }

  const checkLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/auth');
      const tempList = response.data.user.checkout;

      if (Array.isArray(tempList) && tempList.length > 0) {
        const pendingOrders = await Promise.all(tempList.map(async (item) => {
          if (item.order.status == "Pending" || item.order.status == "Delivered" || item.order.status == "Shipped") {
            const tempItemsList = await Promise.all(item.order.items.map(async (product) => {
              const productInfo = await axios.get(`http://localhost:8000/api/product/${product.productId}`);
              if(productInfo.data.data === null) {
                return {
                  quantity: product.quantity,
                  color: product.color,
                  size: product.size,
                  title: "Deleted",
                  image: "https://placehold.co/600x400",
                  hasNull: true
                };
              }
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
              status: item.order.status,
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
          // console.log(order.items)
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
                <div>
                  <strong>Status:</strong> &nbsp;
                  {order.status}
                </div>
                <br />
                {
                  Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, index2) => (
                      item.hasNull ? (
                        <div>This cart contains Deleted Products</div>
                      ) : (
                      <div key={index2} className="order-list">
                        <div className="order-img__container">
                          <img src={item.image} alt={item.title} />
                        </div>
                        <div className="order-title">{item.title}</div>
                        <div className="order-variant">Variant: {item.color || 'N/A'}, {item.size}</div>
                        <div className="order-quantity">Quantity: {item.quantity}</div>
                      </div>
                      )))
                  ) : (
                    <div>No items found for this order.</div>
                  )
                }
                <div className="order-controls">
                  <button className="prime-button" disabled={order.status !== "Delivered"} onClick={() => { console.log(order.status) }}>Confirm Delivery</button>
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })
      }
    </div>
  );
}

export default Profile