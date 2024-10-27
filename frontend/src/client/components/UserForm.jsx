import React, { useState, useEffect } from 'react'
import './styles/Modal.css'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import mainLogo from '../../assets/main-logo.png'
import axios from 'axios'
import { createFunc, updateFunc, fetchDataN } from '../../admin/utils/crudUtils'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const UserForm = ({ modalOpen,setModalOpen, basicInfo }) => {
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('https://ui-avatars.com/api/?name=Miggy+Dacumos?size=512')

    const [formState, setFormState] = useState({
        email: basicInfo.email,
        first_name: '',
        last_name: '',
        birthday: '',
        gender: '',
        contact_number: '',
        address: {},
        avatar: []
    })

    const [formStateAddress, setFormStateAddress] = useState({
        street_address: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
    })

    const [fullName, setFullName] = useState('')

    const { email, first_name, last_name, birthday, gender, contact_number } = formState
    const { street_address, city, state, country, zip_code } = formStateAddress

    const joinName = () => {
        setFullName(first_name + " " + last_name)
    }

    const handleOnChange = (e) => {
        const newImages = [];
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
           
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                    newImages.push(reader.result);

                    setFormState((prevState) => ({
                        ...prevState,
                        avatar: newImages,
                      }));
                }
            }
            reader.readAsDataURL(e.target.files[0])
        } else {
            setFormState({ ...formState, [e.target.name]: e.target.value })
        }
        
    }

    useEffect(() => {
        joinName();
      }, [formState]);

    const handleOnChangeAddress = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])

        } else {
            setFormStateAddress({ ...formStateAddress, [e.target.name]: e.target.value })
            setFormState({ ...formState, address: formStateAddress })
        }
    }

    const pushInfo = async() => {
        await updateFunc('user', basicInfo.id, formState)
        window.location.reload();
    }

    return (
        <div onClick={() => { setModalOpen(false) }} className="modal-background">
            <div className="user-form__container" onClick={(e) => e.stopPropagation()}>
                <div className="form-row-new">
                    <div className="user-avatar">
                        <img src={avatarPreview} alt='User Avatar' />
                    </div>
                    <div className='pb-10'>
                        <input onChange={handleOnChange} type="file" id="avatar" name="avatar"/>
                    </div>
                </div>
                <div className="form-container">
                    <form onSubmit={pushInfo}>
                        <div className="form-divider"><span className="mb-20">Account Details</span></div>
                        <div className="form-row">
                            <TextField value={fullName} name="full_name" id="full_name-basic" label="Full Name" variant="outlined" />
                            <TextField value={email} name="email" id="standard-email" label="Email" variant="outlined" />
                            <TextField onChange={handleOnChange} value={contact_number} name="contact_number" id="contact_number-basic" label="Phone Number" variant="standard" />
                        </div>
                        <div className="form-divider"><span className="mb-20">Profile Details</span></div>
                        <div className="form-row">
                            <TextField onChange={handleOnChange} value={first_name} name="first_name" id="standard-basic" label="First Name" variant="standard" />
                            <TextField onChange={handleOnChange} value={last_name} name="last_name" id="standard-basic" label="Last Name" variant="standard" />
                        </div>
                        <div className="form-row">
                            <TextField onChange={handleOnChangeAddress} value={street_address} name="street_address" id="standard-basic" label="Street Address" variant="standard" />
                            <TextField onChange={handleOnChangeAddress} value={city} name="city" id="standard-basic" label="City" variant="standard" />
                            <TextField onChange={handleOnChangeAddress} value={state} name="state" id="standard-basic" label="State/Region" variant="standard" />
                            <TextField onChange={handleOnChangeAddress} value={country} name="country" id="standard-basic" label="Country" variant="standard" />
                        </div>
                        <div className="form-row">
                            <TextField onChange={handleOnChangeAddress} value={zip_code} name="zip_code" id="standard-basic" label="Zip Code" variant="standard" />
                            <TextField onChange={handleOnChange} value={birthday} name="birthday" id="standard-basic" label="Birthday" variant="standard" />
                            <TextField onChange={handleOnChange} value={gender} name="gender" id="standard-basic" label="Gender" variant="standard" />
                        </div>
                    </form>
                </div>
                <div className="form-control">
                    <Button variant="outlined" sx={{
                        color: 'var(--primary-color)',
                        borderColor: 'var(--primary-color)',
                        '&:hover': {

                        }
                    }}>Close</Button>
                    <Button onClick={() => { pushInfo() }} variant="contained" sx={{
                        color: 'white',
                        backgroundColor: 'var(--primary-color)',
                        '&:hover': {

                        }
                    }}>Save Profile</Button>
                </div>
            </div>
        </div>
    )
}

export default UserForm