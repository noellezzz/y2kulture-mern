import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Button from '@mui/material/Button';
import { fetchData, fetchDataN, createFunc, addToTable, updateFunc, addAndRemoveToTable, deleteFunc } from '../utils/crudUtils';
import { CSSTransition } from 'react-transition-group';
import CreateModal from '../components/CreateModal';
import EditModal from '../components/EditModal';
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
  const [editModal, setEditModal] = useState(false);
  const [editModalCat, setEditModalCat] = useState(false);

  const [formState, setFormState] = useState({});
  const [formStateCat, setFormStateCat] = useState({});
  const [foreignPHolder, setforeignPHolder] = useState('');

  const modalData = {
    title: 'Clothing Type',
    content: 'clothing type.',
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
    title: 'Category',
    content: 'Category.',
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
        placeholder: 'Enter Type',
        value: formStateCat.clothing_type, 
          onChange: (e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedText = e.target.options[selectedIndex].text; 
        
            setFormStateCat({ ...formStateCat, clothing_type: e.target.value });
            setforeignPHolder(selectedText); 
        },
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
        clothingType: (Array.isArray(category.clothing_type) && category.clothing_type.length > 0)
                      ? category.clothing_type[0].title
                      : (typeof category.clothing_type === 'string' && category.clothing_type.trim() !== '')
                        ? category.clothing_type
                        : 'N/A',
        createdAt: new Date(category.createdAt).toLocaleString(),
        updatedAt: new Date(category.updatedAt).toLocaleString(),
      }));
      setFlattenData(flattened);
      console.log(flattened);
    }
  }, [apiDataCat]);

  const loadModalCreate = () => {
    setFormState({title: '', description: '',})
    setOpenModal(true)
  }

  const loadDataById = async (id) => {
    setFormState({_id: '', title: '', description: ''})

    const response = await fetchDataN('type', id) 
    setFormState({
      _id: id,
      title: response.data.data.title, 
      description: response.data.data.description});
    setEditModal(true)
  }

  const loadDataByIdCat = async (id) => {
    setFormState({_id: '', title: '', description: '', clothing_type: ''})
    setforeignPHolder('')
    const response = await fetchDataN('category', id) 
    setFormStateCat({
      _id: id,
      title: response.data.data.title, 
      description: response.data.data.description,
      clothing_type: response.data.data.clothing_type[0]._id
    });
    setforeignPHolder(response.data.data.clothing_type[0].title)
    setEditModalCat(true)
  }

  const handleUpdate = async () => {
    const response = await updateFunc('type', formState._id, formState)
    console.log(formState)
    const newType = {
        _id: response.data.data._id,
        title: formState.title,
        description: formState.description,
        newData: true,
      };

      addAndRemoveToTable(setApiData, newType)
      setFormState({_id: '',title: '', description: '',})
      setEditModal(false);
  };

  const handleUpdateCat = async () => {
    // console.log('pholder', foreignPHolder)
    const response = await updateFunc('category', formStateCat._id, formStateCat)
    const newCat = {
        _id: response.data.data._id,
        title: formStateCat.title,
        description: formStateCat.description,
        clothing_type: foreignPHolder,
        newData: true,
      };
      addAndRemoveToTable(setApiDataCat, newCat)
      setFormStateCat({_id: '',title: '', description: '', clothing_type: ''})
      setEditModalCat(false);
      setforeignPHolder('')
      fetchData('type', setTypeOps);
  };

  const loadModalCreateCat = () => {
    setFormStateCat({title: '', description: '', clothing_type: ''})
    setOpenModalCat(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formState)
    const response = await createFunc('type', formState);

    const newType = {
      _id: response.data.data._id,
      title: formState.title,
      description: formState.description,
      newData: true
    };

    addToTable(setApiData, newType)
    setFormState({title: '', description: ''}); 
    fetchData('type', setTypeOps);
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
      clothing_type: foreignPHolder,
      newData: true
    };

    addToTable(setApiDataCat, newCat)
    setFormStateCat({title: '', description: '', category: ''});
    setOpenModalCat(false);
  };
  
  const handleDelete = (id) => {
    deleteFunc('type', id, setApiData)
    fetchData('type', setTypeOps);
  };
  
  const handleDeleteCat = (id) => {
    deleteFunc('category', id, setApiDataCat)
  };

  return (
    <div className="main-container__admin double-holder">
      <div className="container sub-container__double-lg">
        <div className="container-body">
          <DataTable 
            value={apiData}
            scrollable 
            scrollHeight="290px" 
            style={{ zIndex: 1 }} 
          >
            <Column style={{zIndex: 2}} field="_id" header="ID" />
            <Column style={{zIndex: 2}} field="title" header="Title" />
            <Column style={{zIndex: 2}} field="description" header="Description" />
            <Column 
              style={{zIndex: 2}}
              field="controls" 
              header="Controls" 
              body={(rowData) => (
                <>
                  <Fab onClick={() => loadDataById(rowData._id)} 
                    color="primary" aria-label="edit" size="small" sx={{ zIndex: 0, width: 32, height: 10 }}
                  >
                    <EditIcon sx={{ width: 15, height: 15 }}/>
                  </Fab>
                  &nbsp;
                  <Fab onClick={() => handleDelete(rowData._id)} 
                    color="secondary" aria-label="edit" size="small" sx={{ zIndex: 0, width: 32, height: 10 }}
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
      <div className="container sub-container__double-lg">
        <div className="container-body">
        <DataTable 
            value={flattenData}  
            scrollable 
            scrollHeight="290px" 
            style={{ zIndex: 1 }} 
        >
            <Column style={{zIndex: 2}} field="id" header="ID" />
            <Column style={{zIndex: 2, minWidth:80}} field="title" header="Title" />
            <Column style={{zIndex: 2}} field="description" header="Description" />
            <Column style={{zIndex: 2}} field="clothingType" header="Type" />
            <Column 
              style={{zIndex: 2}}
              field="controls" 
              header="Controls" 
              body={(rowData) => (
                <>
                  <Fab 
                    onClick={() => loadDataByIdCat(rowData.id)} 
                    color="primary" 
                    aria-label="edit" 
                    size="small" 
                    sx={{ zIndex: 0, width: 32, height: 10 }}  
                  >
                    <EditIcon sx={{ width: 15, height: 15 }}/>
                  </Fab>
                  &nbsp;
                  <Fab 
                    onClick={() => handleDeleteCat(rowData.id)} 
                    color="secondary" 
                    aria-label="delete" 
                    size="small" 
                    sx={{ zIndex: 0, width: 32, height: 10 }}  
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

          <CSSTransition
              in={editModalCat}
              timeout={300}
              classNames="modal"
              unmountOnExit
          >
              <EditModal setOpenModal={setEditModalCat} modalData={modalDataCat} handleUpdate={handleUpdateCat} formState={formStateCat} />
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}

export default Category