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

const Category = () => {
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

  const onChangeCat = e => {
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
    setFormStateCat((prevState) => ({
      ...prevState,
      images: newImages,
    }));
  }

  // For Clothing Type
  const [apiData, setApiData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [formState, setFormState] = useState({});
  const [infoModal, setInfoModal] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([])

  const resetFormstate = () => {
    setFormState({ title: '', description: '', images: [] });
    setImagesPreview([])
  }

  const loadDataGen = async(id) => {
    const response = await fetchDataN('type', id) 
    setFormState({
      _id: id,
      title: response.data.data.title, 
      description: response.data.data.description,
      images: response.data.data.images,
    });

    response.data.data.images.map((image) => (
      setImagesPreview(oldArray => [...oldArray, image.url])
    ))
  }

  const loadModalCreate = () => {
    resetFormstate()
    setOpenModal(true)
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
    const response = await createFunc('type', formState);
    const newType = {
      _id: response.data.data._id,
      title: formState.title,
      description: formState.description,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      newData: true
    };
    addToTable(setApiData, newType)
    fetchData('type', setTypeOps);
    setOpenModal(false);
  };

  const handleUpdate = async () => {
    const response = await updateFunc('type', formState._id, formState)
    const newType = {
        _id: response.data.data._id,
        title: formState.title,
        description: formState.description,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        newData: true,
      };
      addAndRemoveToTable(setApiData, newType)
      setEditModal(false);
  };

  const handleDelete = (id) => {
    deleteFunc('type', id, setApiData)
    fetchData('type', setTypeOps);
  };

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

  // For Clothing Category
  
  const [apiDataCat, setApiDataCat] = useState([]);
  const [typeOps, setTypeOps] = useState([]);
  const [flattenData, setFlattenData] = useState([]);
  const [openModalCat, setOpenModalCat] = useState(false);
  const [editModalCat, setEditModalCat] = useState(false);
  const [formStateCat, setFormStateCat] = useState({});
  const [foreignPHolder, setforeignPHolder] = useState('');
  const [infoModalCat, setInfoModalCat] = useState(false);

  const resetFormstateCat = () => {
    setforeignPHolder('')
    setFormStateCat({ title: '', description: '', clothing_type: '', images: [] });
    setImagesPreview([])
  }

  const loadDataGenCat = async(id) => {
    const response = await fetchDataN('category', id) 
    setFormStateCat({
      _id: id,
      title: response.data.data.title, 
      description: response.data.data.description,
      clothing_type: response.data.data.clothing_type[0]._id,
      images: response.data.data.images
    });
    setforeignPHolder(response.data.data.clothing_type[0].title)

    response.data.data.images.map((image) => (
      setImagesPreview(oldArray => [...oldArray, image.url])
    ))
  }

  const loadModalCreateCat = () => {
    resetFormstateCat()
    setOpenModalCat(true)
  }
  const loadDataByIdInfoCat = async (id) => {
    resetFormstateCat()
    loadDataGenCat(id)
    setInfoModalCat(true)
  }

  const loadDataByIdCat = async (id) => {
    resetFormstateCat()
    loadDataGenCat(id)
    setEditModalCat(true)
  }

  const handleSubmitCat = async (event) => {
    event.preventDefault();
    const response = await createFunc('category', formStateCat);
    const newCat = {
      _id: response.data.data._id,
      title: formStateCat.title,
      description: formStateCat.description,
      clothing_type: foreignPHolder,
      newData: true
    };
    addToTable(setApiDataCat, newCat)
    setOpenModalCat(false);
  };

  const handleUpdateCat = async () => {
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
      fetchData('type', setTypeOps);
  };

  const handleDeleteCat = (id) => {
    deleteFunc('category', id, setApiDataCat)
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
      {
        label: 'Images',
        type: 'file',
        name: 'images',
        id: 'custom_file',
        onChange: (e) => onChangeCat(e),
        required: false,
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
            <Column style={{zIndex: 2, verticalAlign: "top"}} field="_id" header="ID" />
            <Column style={{zIndex: 2, verticalAlign: "top"}} field="title" header="Title" />
            <Column style={{zIndex: 2, minWidth: '100px', verticalAlign: "top"}} field="description" header="Description" />
            <Column 
              style={{zIndex: 2, verticalAlign: "top"}}
              field="controls" 
              header="Controls" 
              body={(rowData) => (
                <>
                  <Fab onClick={() => loadDataById(rowData._id)} 
                    color="primary" aria-label="edit" size="small" sx={{ zIndex: 0, width: 32, height: 10, marginBottom:1 }}
                  >
                    <EditIcon sx={{ width: 12, height: 12 }}/>
                  </Fab>
                  &nbsp;
                  <Fab onClick={() => handleDelete(rowData._id)} 
                    color="secondary" aria-label="edit" size="small" sx={{ zIndex: 0, width: 32, height: 10,  marginBottom:1 }}
                  >
                    <DeleteIcon sx={{ width: 12, height: 12 }}/>
                  </Fab>
                  &nbsp;
                  <Fab onClick={() => loadDataByIdInfo(rowData._id)}
                    color="info" aria-label="info" size="small" sx={{ zIndex: 0, width: 32, height: 10,  marginBottom:1 }}
                  >
                    <IoMdEye sx={{ width: 12, height: 12 }} />
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
      <div className="container sub-container__double-lg">
        <div className="container-body">
        <DataTable 
            value={flattenData}  
            scrollable 
            scrollHeight="290px" 
            style={{ zIndex: 1 }} 
        >
            <Column style={{zIndex: 2, verticalAlign: "top"}} field="id" header="ID" />
            <Column style={{zIndex: 2, minWidth:80, verticalAlign: "top"}} field="title" header="Title" />
            <Column style={{zIndex: 2, minWidth: '100px', textOverflow: 'ellipsis', verticalAlign: "top"}} field="description" header="Description" />
            <Column style={{zIndex: 2, verticalAlign: "top"}} field="clothingType" header="Type" />
            <Column 
              style={{zIndex: 2, minWidth: '70px', verticalAlign: "top"}}
              field="controls" 
              header="Controls" 
              body={(rowData) => (
                <>
                  <Fab 
                    onClick={() => loadDataByIdCat(rowData.id)} 
                    color="primary" 
                    aria-label="edit" 
                    size="small" 
                    sx={{ zIndex: 0, width: 32, height: 10, marginBottom:1 }}  
                  >
                    <EditIcon sx={{ width: 15, height: 15 }}/>
                  </Fab>
                  &nbsp;
                  <Fab 
                    onClick={() => handleDeleteCat(rowData.id)} 
                    color="secondary" 
                    aria-label="delete" 
                    size="small" 
                    sx={{ zIndex: 0, width: 32, height: 10,  marginBottom:1 }}  
                  >
                    <DeleteIcon sx={{ width: 15, height: 15 }}/>
                  </Fab>
                  &nbsp;
                  <Fab onClick={() => loadDataByIdInfoCat(rowData.id)}
                    color="info" aria-label="info" size="small" sx={{ zIndex: 0, width: 32, height: 10,  marginBottom:1 }}
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
            onClick={() => {loadModalCreateCat()}}
            >Create New
          </Button>

          <CSSTransition
              in={openModalCat}
              timeout={300}
              classNames="modal"
              unmountOnExit
          >
              <CreateModal setOpenModal={setOpenModalCat} modalData={modalDataCat} handleSubmit={handleSubmitCat} imagesPreview={imagesPreview} setImagesPreview={setImagesPreview} />
          </CSSTransition>

          <CSSTransition
              in={editModalCat}
              timeout={300}
              classNames="modal"
              unmountOnExit
          >
              <EditModal setOpenModal={setEditModalCat} modalData={modalDataCat} handleUpdate={handleUpdateCat} formState={formStateCat} imagesPreview={imagesPreview} setImagesPreview={setImagesPreview} />
          </CSSTransition>

          
          <CSSTransition
            in={infoModalCat}
            timeout={300}
            classNames="modal"
            unmountOnExit
          >
            <InfoModal setOpenModal={setInfoModalCat} modalData={modalDataCat} formState={formStateCat} />
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}

export default Category