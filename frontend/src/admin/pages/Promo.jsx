import React, { useState, useEffect } from 'react';
import "primereact/resources/themes/lara-light-cyan/theme.css";

// Utils
import { fetchData, fetchDataN, createFunc, addToTable, updateFunc, addAndRemoveToTable, deleteFunc } from '../utils/crudUtils';

// Icons and Imported Components
import Fab from '@mui/material/Fab'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IoMdEye } from "react-icons/io";
import Button from '@mui/material/Button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CSSTransition } from 'react-transition-group';

// Modals
import EditModal from '../components/EditModal';
import InfoModal from '../components/InfoModal';
import CreateModal from '../components/CreateModal';

const Promo = () => {
  // Promo Isolate
  const [categoryOps, setCategoryOps] = useState([]);

  // CRUD Necessities
  const [apiData, setApiData] = useState([]);
  const [flattenData, setFlattenData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([])
  const [foreignHolder, setForeignHolder] = useState('')
  const [formState, setFormState] = useState({_id: '', title: '', description: '', promo_for: '', discount: '', voucher_code: '', categoryTitle: ''});

  const onChange = e => {
    const files = Array.from(e.target.files)
    const newImages = [];
    setImagesPreview([]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview(oldArray => [...oldArray, reader.result])
          newImages.push(reader.result);
        }
      }
      reader.readAsDataURL(file)
    })
    setFormState((prevState) => ({
      ...prevState,
      images: newImages,
    }));
  }

  const resetFormstate = () => {
    setForeignHolder('')
    setFormState({ title: '', description: '', promo_for: '', voucher_code: '', discount: '', images: [] });
    setImagesPreview([])
  }

  const loadModalCreate = () => {
    resetFormstate()
    setOpenModal(true)
  }

  const loadDataGen = async(id) => {
    const response = await fetchDataN('promo', id) 
    setFormState({
      _id: id,
      title: response.data.data.title, 
      description: response.data.data.description, 
      promo_for: response.data.data.promo_for[0]._id,
      voucher_code: response.data.data.voucher_code,
      discount: response.data.data.discount,
      images: response.data.data.images,
    });

    response.data.data.images.map((image) => (
      setImagesPreview(oldArray => [...oldArray, image.url])
    ))
  }

  const loadDataById = async (id) => {
    resetFormstate()
    loadDataGen(id)
    setEditModal(true)
  }

  const loadDataByIdInfo = async (id) => {
    resetFormstate()
    loadDataGen(id)
    setInfoModal(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(foreignHolder)
    const response = await createFunc('promo', formState);
    const newPromo = {
      _id: response.data.data._id,
      title: formState.title,
      description: formState.description,
      voucher_code: formState.voucher_code,
      discount: formState.discount,
      promo_for: foreignHolder,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      newData: true
    };
    addToTable(setApiData, newPromo)
    setOpenModal(false);
  };

  const handleUpdate = async () => {
    const response = await updateFunc('promo', formState._id, formState)
    const newPromo = {
        _id: response.data.data._id,
        title: formState.title,
        description: formState.description,
        promo_for: foreignHolder,
        voucher_code: formState.voucher_code,
        discount: formState.discount,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        newData: true,
      };
      addAndRemoveToTable(setApiData, newPromo)
      setEditModal(false);
  };
  
  const handleDelete = (id) => {
    deleteFunc('promo', id, setApiData)
  };

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

        label: 'Discount',
        type: 'number',
        name: 'discount',
        placeholder: 'Enter Discount',
        value: formState.discount, 
        onChange: (e) => setFormState({ ...formState, discount: e.target.value }),
        required: true,
      },
      {

        label: 'Voucher Code',
        type: 'text',
        name: 'voucher_code',
        placeholder: 'Enter voucher_code',
        value: formState.voucher_code, 
        onChange: (e) => setFormState({ ...formState, voucher_code: e.target.value }),
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
            setForeignHolder(selectedText); 
        },
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
        required: false,
      },
    ]
  };

  useEffect(() => {
    fetchData('promo', setApiData);
    fetchData('category', setCategoryOps);
  }, []);

  useEffect(() => {
    if (apiData.length > 0) {
      const flattened = apiData.map(promo => ({
        id: promo._id,
        title: promo.title,
        description: promo.description,
        discount: promo.discount,
        voucher_code: promo.voucher_code,
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

  return (
    <div className="main-container__admin">
      <div className="container sub-container__single-lg">
        <div className="container-body">
          <DataTable 
            value={flattenData} 
            tableStyle={{ minWidth: '50rem' }}
            scrollable 
            scrollHeight="290px" 
            style={{ zIndex: 1 }} 
          >
            <Column style={{ verticalAlign: "top" }} field="id" header="ID" />
            <Column style={{ verticalAlign: "top" }} field="title" header="Title" />
            <Column style={{ verticalAlign: "top" }} field="description" header="Description" />
            <Column style={{ verticalAlign: "top" }} field="discount" header="Discount" />
            <Column style={{ verticalAlign: "top" }} field="voucher_code" header="Voucher Code" />
            <Column style={{ verticalAlign: "top" }} field="promo_for" header="Promo For" />
            <Column style={{ verticalAlign: "top" }} field="createdAt" header="Created At" />
            <Column style={{ verticalAlign: "top" }} field="updatedAt" header="Updated At" />
            <Column 
            style={{ verticalAlign: "top" }}
              field="controls" 
              header="Controls" 
              body={(rowData) => (
                <>
                  <Fab onClick={() => loadDataById(rowData.id)} 
                    color="primary" aria-label="edit" size="small" sx={{ zIndex: 0, width: 32, height: 10, marginBottom:1 }}
                  >
                    <EditIcon sx={{ width: 15, height: 15 }}/>
                  </Fab>
                  &nbsp;
                  <Fab onClick={() => handleDelete(rowData.id)} 
                    color="secondary" aria-label="edit" size="small" sx={{ zIndex: 0, width: 32, height: 10, marginBottom:1 }}
                  >
                    <DeleteIcon sx={{ width: 15, height: 15 }}/>
                  </Fab>
                  &nbsp;
                  <Fab onClick={() => loadDataByIdInfo(rowData.id)}
                    color="info" aria-label="info" size="small" sx={{ zIndex: 0, width: 32, height: 10, marginBottom:1 }}
                  >
                    <IoMdEye sx={{ width: 15, height: 15 }} />
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
              <CreateModal setOpenModal={setOpenModal} modalData={modalData} handleSubmit={handleSubmit} imagesPreview={imagesPreview} setImagesPreview={setImagesPreview} />
          </CSSTransition>

          <CSSTransition
              in={editModal}
              timeout={300}
              classNames="modal"
              unmountOnExit
          >
              <EditModal setOpenModal={setEditModal} modalData={modalData} handleUpdate={handleUpdate} formState={formState} imagesPreview={imagesPreview} setImagesPreview={setImagesPreview} />
          </CSSTransition>

          <CSSTransition
            in={infoModal}
            timeout={300}
            classNames="modal"
            unmountOnExit
          >
            <InfoModal setOpenModal={setInfoModal} modalData={modalData} formState={formState} />
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}

export default Promo;
