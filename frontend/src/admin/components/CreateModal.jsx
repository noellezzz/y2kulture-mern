import React from 'react'
import './styles/Modal.css'
import TextField from '@mui/material/TextField';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button, colors } from '@mui/material'
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const CreateModal = ({ setOpenModal, modalData: { title, content, fields }, handleSubmit, imagesPreview, setImagesPreview }) => {
    const closeModals = () => {
        setImagesPreview([])
        setOpenModal(false)
    }

    return (
        <div
            className='modal-background'
            onClick={() => {
                closeModals();
            }}
        >
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Create New {title}</h2>
                <p>Fill out the following fields to create a new {content}</p>
                <div className="main-area">
                    <form className="crud-form" onSubmit={handleSubmit}>
                        {fields.map((field, index) => (
                            field.col ? (
                                <div key={index} className="input-group-col">

                                    <div className="col">
                                        <label>{field.label}</label>
                                        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                                    </div>

                                    <div className="col" key={field.name2}>
                                        <label>{field.label2}</label>
                                        <input
                                            type={field.type2}
                                            name={field.name2}
                                            placeholder={field.placeholder2}
                                            value={field.value2}
                                            onChange={field.onChange2}
                                            required={field.required2}
                                            className={field.className2}
                                        />
                                    </div>
                                </div>
                            ) :

                                field.type == 'text' || field.type == 'textarea' || field.type == 'password' || field.type == 'email' || field.type == 'number' ? (
                                    <div key={field.name} className="input-group">
                                        <TextField
                                            id="outlined-basic"
                                            label={field.label}
                                            variant="outlined"
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            value={field.value}
                                            onChange={field.onChange}
                                            required={field.required}
                                            className={field.className}
                                        />
                                    </div>
                                ) : field.type == 'select' ? (
                                    <div key={field.name} className="input-group">
                                        <label>{field.label}</label>
                                        <select
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            value={field.value}
                                            onChange={field.onChange}
                                            required={field.required}
                                            className={field.className}
                                        >
                                            <option value="null">Choose an option</option>
                                            {field.options == undefined ? (
                                                <option></option>
                                            ) : (
                                                field.options.map((option, index) => (
                                                    <option key={index} value={option._id}>{option[field.requestFor]}</option>
                                                ))
                                            )
                                            }
                                        </select>
                                    </div>
                                ) : field.type == 'file' ? (
                                    <div key={field.name} className="input-group">
                                        <input
                                            id="outlined-basic"
                                            label={field.label}
                                            variant="outlined"
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            value={field.value}
                                            onChange={field.onChange}
                                            required={field.required}
                                            className={field.className}
                                            multiple
                                        />
                                    </div>
                                ) : field.type == 'select' ? (
                                    <div key={field.name} className="input-group">
                                        <label>{field.label}</label>
                                        <select
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            value={field.value}
                                            onChange={field.onChange}
                                            required={field.required}
                                            className={field.className}
                                        >
                                            <option value="null">Choose an option</option>
                                            {field.options == undefined ? (
                                                <option></option>
                                            ) : (
                                                field.options.map((option, index) => (
                                                    <option key={index} value={option._id}>{option[field.requestFor]}</option>
                                                ))
                                            )
                                            }
                                        </select>
                                    </div>
                                ) : (
                                    <div></div>
                                )
                        ))}

                        <div className="form-control">
                            <span className='secondary-button' onClick={() => { closeModals() }}>Cancel</span>
                            <button className='prime-button' type="submit">Submit</button>
                        </div>
                    </form>
                    <div className="carousel-container">
                        <Carousel
                            className='custom-carousel'
                            NextIcon={<FaArrowAltCircleRight style={{ color: 'var(--primary-color)' }} />}
                            navButtonsProps={{
                                style: {
                                    backgroundColor: 'transparent',
                                    borderRadius: 0
                                }
                            }}
                            PrevIcon={<FaArrowAltCircleLeft style={{ color: 'var(--primary-color)' }} />}
                            animation="slide"
                        >

                            {
                                imagesPreview.map(img => (
                                    <div className="carousel-img__container">
                                        <div className="img-container">
                                            <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                        </div>
                                    </div>
                                ))
                            }
                        </Carousel>
                    </div>
                </div>
                <div className="control-area">

                </div>
            </div>
        </div>
    )
}

export default CreateModal