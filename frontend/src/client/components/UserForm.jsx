import React, { useState, useEffect } from 'react'
import './styles/Modal.css'
import { Link, useFetcher } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import mainLogo from '../../assets/main-logo.png'
import axios from 'axios'
import { createFunc, updateFunc, fetchDataN } from '../../admin/utils/crudUtils'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


const UserForm = ({ modalOpen,setModalOpen, basicInfo }) => {
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('https://ui-avatars.com/api/?name=Miggy+Dacumos?size=512')
    
    const [formState, setFormState] = useState({
        email: basicInfo.email,
        first_name: '',
        last_name: '',
        birthday: dayjs(),
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
            
        }
    }

    useEffect(() => {
        setFormState({ ...formState, address: formStateAddress })
    }, [formStateAddress])

    const pushInfo = async() => {
        console.log(formState)
        await updateFunc('user', basicInfo.id, formState)
        window.location.reload();
    }

    const countries = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "Andorra",
        "Angola",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bhutan",
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana",
        "Brazil",
        "Brunei",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Colombia",
        "Comoros",
        "Congo (Congo-Brazzaville)",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Cyprus",
        "Czechia (Czech Republic)",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini (fmr. Swaziland)",
        "Ethiopia",
        "Fiji",
        "Finland",
        "France",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Greece",
        "Grenada",
        "Guatemala",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Holy See",
        "Honduras",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Mauritania",
        "Mauritius",
        "Mexico",
        "Micronesia",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Morocco",
        "Mozambique",
        "Myanmar (formerly Burma)",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "North Korea",
        "North Macedonia (formerly Macedonia)",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine State",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Poland",
        "Portugal",
        "Qatar",
        "Romania",
        "Russia",
        "Rwanda",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Korea",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Sweden",
        "Switzerland",
        "Syria",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States of America",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Vatican City",
        "Venezuela",
        "Vietnam",
        "Yemen",
        "Zambia",
        "Zimbabwe",
      ];

      const genders = [
       "Male",
       "Female",
        "Other",
      ];
      

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                            {/* <TextField onChange={handleOnChangeAddress} value={country} name="country" id="standard-basic" label="Country" variant="standard" /> */}
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={country}
                                label="Country"
                                name="country"
                                onChange={handleOnChangeAddress}
                                >
                                {
                                    countries.map((country) => {
                                        return(
                                            <MenuItem value={country}>{country}</MenuItem>
                                        )
                                        
                                    })
                                }
                                </Select>
                            </FormControl>
                        </div>
                        <div className="form-row">
                            <TextField onChange={handleOnChangeAddress} value={zip_code} name="zip_code" id="standard-basic" label="Zip Code" variant="standard" sx={{ width: '200px' }}  />
                            {/* <TextField onChange={handleOnChange} value={birthday} name="birthday" id="standard-basic" label="Birthday" variant="standard" /> */}

                                <DatePicker label="Basic date picker" 
                                 name="birthday" id="standard-basic" variant="standard" onChange={handleOnChange} value={birthday}
                                sx={{
                                    width: '280px',
                                    '& .MuiInputBase-root': {
                                        height: '50px',  // Adjust the height of the input field
                                    },
                                }}/>

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={gender}
                                label="Gender"
                                name="gender"
                                onChange={handleOnChange}
                                sx={{height: '50px',
                                    margin: '7px',
                                    width: '150px',
                                }}
                                >
                                {
                                    genders.map((gender) => {
                                        return(
                                            <MenuItem value={gender}>{gender}</MenuItem>
                                        )
                                        
                                    })
                                }
                                </Select>
                            </FormControl>
                            
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
        </LocalizationProvider>
    )
}

export default UserForm