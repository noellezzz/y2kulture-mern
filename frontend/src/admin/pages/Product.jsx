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

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import { IconButton, Typography, Grid } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

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

  const loadDataGen = async (id) => {
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


  const columns = [
    {
      field: 'expand',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        <IconButton onClick={() => toggleRowExpansion(params.row.id)} size="small">
          {expandedRowIds.has(params.row.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      ),
    },
    { field: 'id', headerName: 'ID', width: 230 },
    { field: 'title', headerName: 'Title', width: 130 },
    { field: 'description', headerName: 'Description', width: 170 },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      width: 90,
    },
    {
      field: 'material',
      headerName: 'Material',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 80,
    },
    { field: 'categoryTitle', headerName: 'Category', width: 130 },
    { field: 'createdAt', headerName: 'Created At', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            onClick={() => loadDataByIdEdit(params.row.id)}
            color="primary"
            size="small"
            sx={{ minWidth: 32, height: 32, padding: 0, marginRight: 1 }}
          >
            <EditIcon sx={{ width: 18, height: 18 }} />
          </Button>
          <Button
            onClick={() => handleDelete(params.row.id)}
            color="secondary"
            size="small"
            sx={{ minWidth: 32, height: 32, padding: 0 }}
          >
            <DeleteIcon sx={{ width: 18, height: 18 }} />
          </Button>
        </>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [expandedRowIds, setExpandedRowIds] = useState(new Set());

  const toggleRowExpansion = (id) => {
    setExpandedRowIds((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  const handleSelectionChange = (selectionModel) => {
    console.log('Current Selection Model:', selectionModel); // Debugging line
    setSelectedRowIds(selectionModel);
  };

  const printSelectedIds = async() => {
    try {
      selectedRowIds.map((ids) => {
        handleDelete(ids)
      })
    } catch(e) {
      console.log(e)
    }
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

  const logData = () => {
    console.log(flattenData)
  }

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
          <DataGrid
            rows={flattenData}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </div>

        <div className="container-footer">
          {/* <button onClick={printSelectedIds}>Print Selected IDs</button> */}
          <Button variant="contained" className='invert-button'
            onClick={() => { printSelectedIds() }}
          >Delete Selected Rows
          </Button>
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
            <StockModal setOpenModal={setStockModal} modalData={modalData} />
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}

export default Product;