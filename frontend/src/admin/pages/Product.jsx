import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Button from '@mui/material/Button';
import { fetchData, fetchDataN, createFunc, addToTable, updateFunc, addAndRemoveToTable, deleteFunc } from '../utils/crudUtils';
import { CSSTransition } from 'react-transition-group';
import CreateModal from '../components/CreateModal';
import Fab from '@mui/material/Fab'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditModal from '../components/EditModal';

const Product = () => {
  const [apiData, setApiData] = useState([]);
  const [categoryOps, setCategoryOps] = useState([]);
  const [flattenData, setFlattenData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([])

  const [formState, setFormState] = useState({_id: '', title: '', description: '', category: '', categoryId: ''});
  const onChange = e => {
    const files = Array.from(e.target.files)
    const newImages = [];
    setImagesPreview([]);
    setImages([])
    files.forEach(file => {
        const reader = new FileReader();
        
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImagesPreview(oldArray => [...oldArray, reader.result])
                setImages(oldArray => [...oldArray, reader.result])
                newImages.push(reader.result);
            }
        }
        reader.readAsDataURL(file)

        // console.log(reader)
    })
    setFormState((prevState) => ({
      ...prevState,
      images: newImages,
  }));
    console.log(images)
    console.log(formState)
}
  const modalData = {
    title: 'Product',
    content: 'product.',
    fields: [
      {
        label: 'Product',
        type: 'text',
        name: 'product',
        placeholder: 'Enter Product',
        className: 'input-field',
        value: formState.title, 
        onChange: (e) => setFormState({ ...formState, title: e.target.value }),
        required: true,
        withForeign: false,
      },
      {
        label: 'Description',
        type: 'text',
        name: 'description',
        placeholder: 'Enter Description',
        value: formState.description, 
        onChange: (e) => setFormState({ ...formState, description: e.target.value }),
        required: true,
      },
      {
        label: 'Category',
        type: 'select',
        name: 'category',
        placeholder: 'Enter Category',
        value: formState.category,
        onChange: (e) => setFormState({ ...formState, category: e.target.value, categoryTitle: e.target.title }),
        required: true,
        options: categoryOps,
        requestFor: 'title',
        withForeign: false,
      },
      {
        label: 'Images',
        type: 'file',
        name: 'images',
        id: 'custom_file',
        onChange: (e) => onChange(e),
        required: true,
      },
    ]
  };
  

  useEffect(() => {
    fetchData('product', setApiData);
    fetchData('category', setCategoryOps);
  }, []);
  
  useEffect(() => {
    console.log(categoryOps)
  }, []);

  useEffect(() => {
    if (apiData.length > 0) {
      const flattened = apiData.map(product => ({
        id: product._id,
        title: product.title,
        description: product.description,
        categoryTitle: (product.category && Array.isArray(product.category) && product.category.length > 0) 
                        ? product.category[0].title 
                        : 'N/A',
        // clothingType: product.category[0]?.clothing_type.map(ct => ct.title).join(', ') || 'N/A',
        createdAt: new Date(product.createdAt).toLocaleString(),
        updatedAt: new Date(product.updatedAt).toLocaleString(),
      }));
      setFlattenData(flattened);
      console.log(flattened);
    }
  }, [apiData]);

  const loadModalCreate = () => {
    setFormState({title: '', description: '', category: '', images: []}); 
    setOpenModal(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    
    formData.append('title', formState.title);
    formData.append('description', formState.description);
    formData.append('category', formState.category);
    images.forEach((image) => {
      formData.append('images', image)
    });

    console.log(formState)

    const response = await createFunc('product', formState);
    const newProduct = {
      _id: response.data.data._id,
      title: formState.description,
      description: formState.description,
      category: formState.category,
      newData: true
    };

    addToTable(setApiData, newProduct)
    setFormState({title: '', description: '', category: ''}); 
    setOpenModal(false);
  };

  const loadDataById = async (id) => {
    const response = await fetchDataN('product', id) 
    setFormState({
      _id: id,
      title: response.data.data.title, 
      description: response.data.data.description, 
      category: response.data.data.category[0]._id, });
    setEditModal(true)
  }

  const handleUpdate = async () => {
    const response = await updateFunc('product', formState._id, formState)
    console.log(formState)
    const newProduct = {
        _id: response.data.data._id,
        title: formState.title,
        description: formState.description,
        categoryId: formState.categoryId,
        newData: true,
      };

      addAndRemoveToTable(setApiData, newProduct)
      setFormState({_id: '',title: '', description: '', categoryId: '', category: ''})
      setEditModal(false);
  };
  
  const handleDelete = (id) => {
    deleteFunc('product', id, setApiData)
  };

  return (
    <div className="main-container__admin">
      <div className="container sub-container__single-lg">
        <div className="container-body">
          <DataTable 
            value={flattenData} 
            tableStyle={{ minWidth: '50rem' }}
            scrollable 
            scrollHeight="320px" 
            style={{ zIndex: 1 }} 
          >
            <Column field="id" header="ID" />
            <Column field="title" header="Title" />
            <Column field="description" header="Description" />
            <Column field="categoryTitle" header="Category" />
            {/* <Column field="clothingType" header="Clothing Type" /> */}
            <Column field="createdAt" header="Created At" />
            <Column field="updatedAt" header="Updated At" />
            <Column 
              field="controls" 
              header="Controls" 
              body={(rowData) => (
                <>
                  <Fab onClick={() => loadDataById(rowData.id)} 
                    color="primary" aria-label="edit" size="small" sx={{ width: 32, height: 10 }}
                  >
                    <EditIcon sx={{ width: 15, height: 15 }}/>
                  </Fab>
                  &nbsp;
                  <Fab onClick={() => handleDelete(rowData.id)} 
                    color="secondary" aria-label="edit" size="small" sx={{ width: 32, height: 10 }}
                  >
                    <DeleteIcon sx={{ width: 15, height: 15 }}/>
                  </Fab>
                </>
              )}
            />
          </DataTable>
        </div>

        <div className="container-footer">
          <Button variant="contained" 
            onClick={() => {loadModalCreate()}}
            >Create New
          </Button>

          <CSSTransition
              in={openModal}
              timeout={300}
              classNames="modal"
              unmountOnExit
          >
              <CreateModal setOpenModal={setOpenModal} modalData={modalData} handleSubmit={handleSubmit} />
          </CSSTransition>

          <CSSTransition
              in={editModal}
              timeout={300}
              classNames="modal"
              unmountOnExit
          >
              <EditModal setOpenModal={setEditModal} modalData={modalData} handleUpdate={handleUpdate} formState={formState} />
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}

export default Product;
