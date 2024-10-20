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

const Product = () => {
  const [apiData, setApiData] = useState([]);
  const [categoryOps, setCategoryOps] = useState([]);
  const [flattenData, setFlattenData] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [formState, setFormState] = useState({title: '', description: '', category: '',});

  const modalData = {
    title: 'Create New Product',
    content: 'Fill out the form below to create a new product.',
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
        onChange: (e) => setFormState({ ...formState, category: e.target.value }),
        required: true,
        options: categoryOps,
        requestFor: 'title',
        withForeign: false,
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
        categoryTitle: product.category[0]?.title || 'N/A',
        // clothingType: product.category[0]?.clothing_type.map(ct => ct.title).join(', ') || 'N/A',
        createdAt: new Date(product.createdAt).toLocaleString(),
        updatedAt: new Date(product.updatedAt).toLocaleString(),
      }));
      setFlattenData(flattened);
      console.log(flattened);
    }
  }, [apiData]);

  const loadModalCreate = () => {
    setOpenModal(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const response = await createFunc('product', formState);
    console.log(response)
    const newProduct = {
      _id: response.data.data._id,
      title: formState.title,
      description: formState.description,
      category: formState.category,
      newData: true
    };

    addToTable(setApiData, newProduct)
    setFormState({title: '', description: '', category: ''}); 
    setOpenModal(false);
  };

  const handleEdit = (product) => {
    console.log("Edit clicked for:", product);
  };
  
  const handleDelete = (id) => {
    deleteFunc('product', id, setApiData)
  };

  return (
    <div className="main-container__admin">
      <div className="container sub-container__single-lg">
        <div className="container-body">
          <DataTable value={flattenData} tableStyle={{ minWidth: '50rem' }}>
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
                  <Fab onClick={() => handleEdit(rowData)} 
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
        </div>
      </div>
    </div>
  );
}

export default Product;
