import React from 'react'
import './styles/Modal.css'
import TextField from '@mui/material/TextField';

const EditModal = ({ setOpenModal, modalData: { title, content, fields }, handleUpdate, formState }) => {
    const closeModals = () => {
        setOpenModal(false)
    }
    console.log(formState)
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
                <h2>Edit {title}</h2>
                <p>Fill out the following fields to update this {content}</p>
                <form className="crud-form" onSubmit={handleUpdate}>
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
                    
                    field.type == 'text' || field.type == 'textarea' || field.type == 'password' ||  field.type == 'email' || field.type == 'number' ?(
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
                        { field.options == undefined ? (
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
                    <span className='secondary-button' onClick={() => {closeModals()}}>Cancel</span>
                    <span className='prime-button' onClick={() => {handleUpdate()}}>Submit</span>
                </div>
                </form>
            </div>
        </div>
      )
}

export default EditModal