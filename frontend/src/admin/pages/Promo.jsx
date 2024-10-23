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

const Promo = () => {
  const [apiData, setApiData] = useState([]);
  const [categoryOps, setCategoryOps] = useState([]);
  const [flattenData, setFlattenData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [foreignPHolder, setforeignPHolder] = useState('');

  const [formState, setFormState] = useState({_id: '', title: '', description: '', promo_for: '', categoryTitle: ''});

  const modalData = {
    title: 'Promo',
    content: 'promo.',
    fields: [
      {
        label: 'Promo',
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
      {
        label: 'Promo For',
        type: 'select',
        name: 'promo_for',
        placeholder: 'Enter Promo',
        value: formState.promo_for,
        onChange: (e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedText = e.target.options[selectedIndex].text; 
        
            setFormState({ ...formState, promo_for: e.target.value, categoryTitle: e.target.title });
            setforeignPHolder(selectedText); 
        },
        required: true,
        options: categoryOps,
        requestFor: 'title',
        withForeign: false,
      },
    ]
  };

  useEffect(() => {
    fetchData('promo', setApiData);
    fetchData('category', setCategoryOps);
  }, []);
  
  // useEffect(() => {
  //   console.log(categoryOps)
  // }, []);

  useEffect(() => {
    if (apiData.length > 0) {
      const flattened = apiData.map(promo => ({
        id: promo._id,
        title: promo.title,
        description: promo.description,
        promo_for: (Array.isArray(promo.promo_for) && promo.promo_for.length > 0)
                    ? promo.promo_for[0].title
                    : (typeof promo.promo_for === 'string' && promo.promo_for.trim() !== '')
                      ? promo.promo_for
                      : 'N/A',
        createdAt: new Date(promo.createdAt).toLocaleString(),
        updatedAt: new Date(promo.updatedAt).toLocaleString(),
      }));
      setFlattenData(flattened);
      console.log(flattened);
    }
  }, [apiData]);

  const loadModalCreate = () => {
    setFormState({title: '', description: '', promo_for: ''}); 
    setOpenModal(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formState)
    const response = await createFunc('promo', formState);
    const newPromo = {
      _id: response.data.data._id,
      title: formState.description,
      description: formState.description,
      promo_for: foreignPHolder,
      newData: true
    };

    addToTable(setApiData, newPromo)
    setFormState({title: '', description: '', promo_for: ''}); 
    setOpenModal(false);
  };

  const loadDataById = async (id) => {
    const response = await fetchDataN('promo', id) 
    console.log(response)
    setFormState({
      _id: id,
      title: response.data.data.title, 
      description: response.data.data.description, 
      promo_for: response.data.data.promo_for[0]._id
    });
    setEditModal(true)
  }

  const handleUpdate = async () => {
    const response = await updateFunc('promo', formState._id, formState)
    console.log(formState)
    const newPromo = {
        _id: response.data.data._id,
        title: formState.title,
        description: formState.description,
        promo_for: formState.promo_for,
        newData: true,
      };

      addAndRemoveToTable(setApiData, newPromo)
      setFormState({_id: '',title: '', description: '', categoryId: '', promo_for: ''})
      setEditModal(false);
  };
  
  const handleDelete = (id) => {
    deleteFunc('promo', id, setApiData)
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
            <Column field="promo_for" header="Promo For" />
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

export default Promo;
