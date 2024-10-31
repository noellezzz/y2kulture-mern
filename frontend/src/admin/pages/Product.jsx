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
import StockModal from '../components/StockModal'
import { MdInventory } from "react-icons/md";

const Product = () => {
  // Product Isolate
  const [categoryOps, setCategoryOps] = useState([]);

  // CRUD Necessities
  const [apiData, setApiData] = useState([]);
  const [flattenData, setFlattenData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [stockModal, setStockModal] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([])
  const [foreignHolder, setForeignHolder] = useState('')
  const [formState, setFormState] = useState({ _id: '', title: '', description: '', category: '', price: '', material: '', categoryId: '' });

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
    setFormState({ title: '', description: '', category: '', price: '', material: '', images: [] });
    setImagesPreview([])
  }

  const loadModalCreate = () => {
    resetFormstate()
    setOpenModal(true)
  }

  const loadDataGen = async(id) => {
    const response = await fetchDataN('product', id)
    setFormState({
      _id: id,
      title: response.data.data.title,
      description: response.data.data.description,
      price: response.data.data.price,
      material: response.data.data.material,
      category: response.data.data.category[0]._id,
      images: response.data.data.images,
    });

    response.data.data.images.map((image) => (
      setImagesPreview(oldArray => [...oldArray, image.url])
    ))
  }

  const loadDataByIdEdit = async (id) => {
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
    event.preventDefault()
    const response = await createFunc('product', formState);
    const newProduct = {
      _id: response.data.data._id,
      title: formState.title,
      description: formState.description,
      price: formState.price,
      material: formState.material,
      category: foreignHolder,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      newData: true
    };
    addToTable(setApiData, newProduct)
    setOpenModal(false);
  };

  const handleUpdate = async () => {
    const response = await updateFunc('product', formState._id, formState)
    console.log(formState)
    const newProduct = {
      _id: response.data.data._id,
      title: formState.title,
      description: formState.description,
      price: formState.price,
      material: formState.material,
      category: foreignHolder,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      newData: true,
    };
    addAndRemoveToTable(setApiData, newProduct)
    setEditModal(false);
  };

  const handleDelete = (id) => {
    deleteFunc('product', id, setApiData)
  };

  const modalData = {
    title: 'Product',
    content: 'product.',
    fields: [
      {
        label: 'Title',
        type: 'text',
        name: 'product',
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
        label: 'Price',
        type: 'number',
        name: 'price',
        placeholder: 'Enter Price',
        value: formState.price,
        onChange: (e) => setFormState({ ...formState, price: e.target.value }),
        required: true,
      },
      {
        label: 'Material',
        type: 'text',
        name: 'material',
        placeholder: 'Enter Material',
        value: formState.material,
        onChange: (e) => setFormState({ ...formState, material: e.target.value }),
        required: true,
      },
      {
        label: 'Category',
        type: 'select',
        name: 'category',
        placeholder: 'Enter Category',
        value: formState.category,
        onChange: (e) => {
          setFormState({ ...formState, category: e.target.value, categoryTitle: e.target.title })
          setForeignHolder(e.target.selectedOptions[0].text)
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
    fetchData('product', setApiData);
    fetchData('category', setCategoryOps);
  }, []);

  useEffect(() => {
    if (apiData.length > 0) {
      const flattened = apiData.map(product => ({
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        material: product.material,
        categoryTitle: (typeof product.category === 'string')
          ? product.category
          : (Array.isArray(product.category) && product.category.length > 0)
            ? product.category[0].title
            : 'N/A',
        createdAt: new Date(product.createdAt).toLocaleString(),
        updatedAt: new Date(product.updatedAt).toLocaleString(),
      }));
      setFlattenData(flattened);
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
            <Column style={{ zIndex: 2, verticalAlign: "top", verticalAlign: "top" }} field="id" header="ID" />
            <Column style={{ zIndex: 2, verticalAlign: "top", verticalAlign: "top" }} field="title" header="Title" />
            <Column style={{ zIndex: 2, minWidth: '200px', verticalAlign: "top", verticalAlign: "top" }} field="description" header="Description" />
            <Column style={{ zIndex: 2, verticalAlign: "top", verticalAlign: "top" }} field="price" header="Price" />
            <Column style={{ zIndex: 2, verticalAlign: "top", verticalAlign: "top" }} field="material" header="Material" />
            <Column style={{ zIndex: 2, verticalAlign: "top", verticalAlign: "top" }} field="categoryTitle" header="Category" />
            <Column style={{ zIndex: 2, verticalAlign: "top", verticalAlign: "top" }} field="createdAt" header="Created At" />
            <Column style={{ zIndex: 2, verticalAlign: "top", verticalAlign: "top" }} field="updatedAt" header="Updated At" />
            <Column
              style={{ zIndex: 2, verticalAlign: "top" }}
              field="controls"
              header="Controls"
              body={(rowData) => (
                <div className='gap-10'>
                  <Fab onClick={() => loadDataByIdEdit(rowData.id)}
                    color="primary" aria-label="edit" size="small" sx={{ zIndex: 0, width: 32, height: 10,  marginBottom:1 }}
                  >
                    <EditIcon sx={{ width: 15, height: 15 }} />
                  </Fab>
                  &nbsp;
                  <Fab onClick={() => handleDelete(rowData.id)}
                    color="secondary" aria-label="delete" size="small" sx={{ zIndex: 0, width: 32, height: 10,  marginBottom:1 }}
                  >
                    <DeleteIcon sx={{ width: 15, height: 15 }} />
                  </Fab>
                  &nbsp;
                  <Fab onClick={() => loadDataByIdInfo(rowData.id)}
                    color="info" aria-label="info" size="small" sx={{ zIndex: 0, width: 32, height: 10, marginBottom:1 }}
                  >
                    <IoMdEye sx={{ width: 15, height: 15 }} />
                  </Fab>
                  &nbsp;
                  <Fab onClick={() => {setStockModal(true)}}
                    color="success" aria-label="success" size="small" sx={{ color:'white', zIndex: 0, width: 32, height: 10, marginBottom:1 }}
                  >
                    <MdInventory sx={{ width: 15, height: 15 }} />
                  </Fab>
                </div>
              )}
            />
          </DataTable>
        </div>

        <div className="container-footer">
          <Button variant="contained"
            onClick={() => { loadModalCreate() }}
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

          <CSSTransition
            in={stockModal}
            timeout={300}
            classNames="modal"
            unmountOnExit
          >
            <StockModal setOpenModal={setStockModal} modalData={modalData}/>
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}

export default Product;