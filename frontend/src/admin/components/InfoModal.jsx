import React from 'react'
import './styles/Modal.css'
import TextField from '@mui/material/TextField';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button, colors } from '@mui/material'
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const InfoModal = ({ setOpenModal, modalData: { title, content, fields }, formState }) => {
    const imagesToDisplay = Array.isArray(formState.images) ? formState.images : [];

    const closeModals = () => {
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
            className="modal-container-portrait"
            onClick={(e) => e.stopPropagation()}
        >
        <div className="display-modal__img-container">
            <Carousel 
                className='custom-carousel'
                NextIcon={<FaArrowAltCircleRight style={{ color: 'var(--primary-color)' }}/>}
                navButtonsProps={{
                    style: {
                        backgroundColor: 'transparent',
                        borderRadius: 0
                    }
                }} 
                PrevIcon={<FaArrowAltCircleLeft style={{ color: 'var(--primary-color)' }}/>}
                animation="slide"
            >
                        
                {
                    imagesToDisplay.map((image, index) => (
                        <img src={image.url} key={index} alt={`Image ${index + 1}`} />
                    ))
                }
            </Carousel>
        </div>
        {fields.map((field, index) => (            
            <div class="detail-container" key={index}>{field.label}: {field.value}</div>
        ))
        }
        </div>
    </div>
  )
}
export default InfoModal