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

const Category = () => {
  const [apiData, setApiData] = useState([]);
  const [apiDataCat, setApiDataCat] = useState([]);
  const [typeOps, setTypeOps] = useState([]);
  const [flattenData, setFlattenData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCat, setOpenModalCat] = useState(false);

  const [formState, setFormState] = useState({title: '', description: ''});
  const [formStateCat, setFormStateCat] = useState({title: '', description: '', clothing_type: ''});

  const modalData = {
    title: 'Create New Clothing Type',
    content: 'Fill out the form below to create a new clothing type.',
    fields: [
      {
        label: 'Title',
        type: 'text',
        name: 'title',
        placeholder: 'Enter Title',
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
    ]
  };

  const modalDataCat = {
    title: 'Create New Clothing Category',
    content: 'Fill out the form below to create a new clothing Category.',
    fields: [
      {
        label: 'Title',
        type: 'text',
        name: 'title',
        placeholder: 'Enter Title',
        className: 'input-field',
        value: formStateCat.title, 
        onChange: (e) => setFormStateCat({ ...formStateCat, title: e.target.value }),
        required: true,
        withForeign: false,
      },
      {
        label: 'Description',
        type: 'text',
        name: 'description',
        placeholder: 'Enter Description',
        value: formStateCat.description, 
        onChange: (e) => setFormStateCat({ ...formStateCat, description: e.target.value }),
        required: true,
      },
      {
        label: 'Clothing Type',
        type: 'select',
        name: 'clothing_type',
        placeholder: 'Enter User',
        value: formStateCat.clothing_type, 
        onChange: (e) => setFormStateCat({ ...formStateCat, clothing_type: e.target.value }),
        required: true,
        options: typeOps,
        requestFor: 'title',
        withForeign: false,
      },
    ]
  };

  useEffect(() => {
    fetchData('type', setApiData);
    fetchData('category', setApiDataCat);
    fetchData('type', setTypeOps);
  }, []);

  useEffect(() => {
    if (apiDataCat.length > 0) {
      const flattened = apiDataCat.map(category => ({
        id: category._id,
        title: category.title,
        description: category.description,
        clothingType: category.clothing_type[0]?.title || 'N/A',
        createdAt: new Date(category.createdAt).toLocaleString(),
        updatedAt: new Date(category.updatedAt).toLocaleString(),
      }));
      setFlattenData(flattened);
      console.log(flattened);
    }
  }, [apiDataCat]);

  const loadModalCreate = () => {
    setOpenModal(true)
  }

  const loadModalCreateCat = () => {
    setOpenModalCat(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await createFunc('type', formState);

    const newType = {
      _id: response.data.data._id,
      title: formState.title,
      description: formState.description,
      newData: true
    };

    addToTable(setApiData, newType)
    setFormState({title: '', description: ''}); 
    setOpenModal(false);
  };

  const handleSubmitCat = async (event) => {
    event.preventDefault();
    console.log(formStateCat)
    const response = await createFunc('category', formStateCat);

    const newCat = {
      _id: response.data.data._id,
      title: formStateCat.title,
      description: formStateCat.description,
      clothing_type: formStateCat.clothing_type,
      newData: true
    };

    addToTable(setApiDataCat, newCat)
    setFormStateCat({title: '', description: '', category: ''}); 
    setOpenModalCat(false);
  };

  const handleEdit = (product) => {
    console.log("Edit clicked for:", product);
  };
  
  const handleDelete = (id) => {
    deleteFunc('type', id, setApiDataCat)
  };
  
  const handleDeleteCat = (id) => {
    deleteFunc('category', id, setApiDataCat)
  };

  return (
    <div className="main-container__admin double-holder">
      <div className="container sub-container__double-lg">
        <div className="container-body">
          <DataTable value={apiData}>
            <Column field="_id" header="ID" />
            <Column field="title" header="Title" />
            <Column field="description" header="Description" />
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
                  <Fab onClick={() => handleDelete(rowData._id)} 
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
      <div className="container sub-container__double-lg">
        <div className="container-body">
          <DataTable value={flattenData}>
            <Column field="id" header="ID" />
            <Column field="title" header="Title" />
            <Column field="description" header="Description" />
            <Column field="clothingType" header="Type" />
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
                  <Fab onClick={() => handleDeleteCat(rowData.id)} 
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
            onClick={() => {loadModalCreateCat()}}
            >Create New
          </Button>

          <CSSTransition
              in={openModalCat}
              timeout={300}
              classNames="modal"
              unmountOnExit
          >
              <CreateModal setOpenModal={setOpenModalCat} modalData={modalDataCat} handleSubmit={handleSubmitCat} />
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}

export default Category