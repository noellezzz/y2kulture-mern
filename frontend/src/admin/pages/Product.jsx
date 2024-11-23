import React, { useState, useEffect } from 'react';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import axios from 'axios';

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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { IconButton, Typography, Grid } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import { FaPlus, FaTrash } from "react-icons/fa";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

const Product = () => {
  // Product Isolate
  const [categoryOps, setCategoryOps] = useState([]);

  // CRUD Necessities
  const [apiData, setApiData] = useState([]);
  const [flattenData, setFlattenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [stockModal, setStockModal] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([])
  const [foreignHolder, setForeignHolder] = useState('')
  const [checkedId, setCheckedId] = useState([]);
  const [formState, setFormState] = useState({ _id: '', title: '', description: '', category: '', price: '', material: '', categoryId: '' });

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
    const response = await axios.get(`http://localhost:8000/api/product/${id}`)
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
    const response = await axios.post('http://localhost:8000/api/product', formState);
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
    setApiData((prevData) => [...prevData, newProduct])
    setTimeout(() => { 

      window.location.reload()
  }, 500);
    setOpenModal(false);
  };

  const handleUpdate = async () => {
    const response = await axios.put(`http://localhost:8000/api/product/${formState._id}`, formState)
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
    setApiData((prevData) => prevData.map((data) => data._id === newProduct._id ? newProduct : data))
    setEditModal(false);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/product/${id}`)
    setApiData((prevData) => prevData.filter((data) => data._id !== id))
  };

  const loadContents = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/product/${id}`)
    } catch (e) {
      console.log(e)
    }
  }

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

  const printSelectedIds = async () => {
    try {
      selectedRowIds.map((ids) => {
        handleDelete(ids)
      })
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/product?page=${page}&limit=${limit}`);
        if (response.data.success) {
          setApiData(response.data.data);
          setTotal(response.data.pagination.total);
          setTotalPages(response.data.pagination.pages);
        } else {
          setError('Failed to fetch products');
        }

        // Fetch categories
        const catResponse = await axios.get('http://localhost:8000/api/category');
        if (catResponse.data.success) {
          setCategoryOps(catResponse.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit]);

  useEffect(() => {
    if (apiData.length > 0) {
      const flattened = apiData.map(product => ({
        id: product._id,
        title: product.title || 'No Title',
        description: product.description || 'No Description',
        price: product.price || 0,
        material: product.material || 'No Material',
        categoryTitle: product.category?.title || 'Uncategorized',
        createdAt: new Date(product.createdAt).toLocaleString(),
        updatedAt: new Date(product.updatedAt).toLocaleString(),
        stock: Array.isArray(product.stock) ? product.stock : []
      }));
      setFlattenData(flattened);
    }
  }, [apiData]);

  const logData = () => {
    console.log(flattenData)
  }

  const handleCheck = (id, isChecked) => {
    setCheckedId((prevCheckedId) => {
      if (isChecked) {
        return [...prevCheckedId, id];
      } else {
        return prevCheckedId.filter((item) => item !== id);
      }
    });
  };

  const bulkDelete = () => {
    try {
      checkedId.map((id) => {
        handleDelete(id)
      })
    } catch (e) {
      console.log(e)
    }
  }

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

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-container__admin">
      <div className="container sub-container__single-lg">
        <div className="container-body">
          <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="center">
                    {/* <Checkbox
                        checked={checked[0] && checked[1]}
                        indeterminate={checked[0] !== checked[1]}
                        onChange={handleChange1}
                      /> */}
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Title</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Material</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flattenData ? (
                  flattenData.length > 0 ? (
                    flattenData.map((row) => (
                      <Row key={row.id} row={row} handleCheck={handleCheck} loadEditModal={loadDataByIdEdit} deleteCourse={handleDelete} loadContents={loadContents} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography>No Data Available</Typography>
                      </TableCell>
                    </TableRow>
                  )
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="container-footer" style={{ padding: '16px' }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {/* Action Buttons Row */}

            {/* Pagination Row */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              {/* Left side - Page Size & Total */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flex: '1 1 auto'
              }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    sx={{
                      height: '36px',
                      '& .MuiSelect-select': {
                        paddingY: '8px',
                      }
                    }}
                  >
                    <MenuItem value={5}>5 per page</MenuItem>
                    <MenuItem value={10}>10 per page</MenuItem>
                    <MenuItem value={20}>20 per page</MenuItem>
                    <MenuItem value={50}>50 per page</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2" sx={{ color: 'text.secondary', minWidth:'200px' }}>
                  Total Products: {total}
                </Typography>
              </Box>

              {/* Right side - Pagination Controls */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flex: '0 0 auto'
              }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  sx={{
                    minWidth: '32px',
                    height: '32px',
                    px: 1
                  }}
                >
                  <NavigateBeforeIcon />
                </Button>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mx: 2,
                    minWidth: '100px',
                    textAlign: 'center'
                  }}
                >
                  Page {page} of {totalPages}
                </Typography>
                <Button 
                  variant="outlined"
                  size="small"
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  sx={{
                    minWidth: '32px',
                    height: '32px',
                    px: 1
                  }}
                >
                  <NavigateNextIcon />
                </Button>
              </Box>
            </Box>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'flex-start',
              gap: 2,
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
              pb: 2
            }}>
              <Button 
              className='MuiButton-custom___btn'
                variant="contained"
                onClick={() => { loadModalCreate() }}
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  }
                }}
              >
                Create New
              </Button>
              <Button 
                variant="contained" 
                className='invert-button'
                onClick={() => { printSelectedIds() }}
                sx={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#c62828',
                  }
                }}
              >
                Delete Selected Rows
              </Button>
              <Button 
                variant="contained" 
                className='invert-button'
                onClick={() => { bulkDelete() }}
                sx={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#c62828',
                  }
                }}
              >
                Bulk Delete
              </Button>
            </Box>
          </Box>

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

function Row(props) {
  const { row, handleCheck, loadEditModal, deleteCourse, loadContents } = props;
  const [open, setOpen] = React.useState(false);
  console.log(row)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">
          <Checkbox
            inputProps={{ 'aria-label': 'controlled' }}
            onChange={(e) => handleCheck(row.id, e.target.checked)}
          />
        </TableCell>
        <TableCell component="th" scope="row" sx={{ minWidth:'400px' }}>{row.id}</TableCell>
        <TableCell align="right">{row.title}</TableCell>
        <TableCell align="right">{row.description}</TableCell>
        <TableCell align="right">{row.price}</TableCell>
        <TableCell align="right">{row.material}</TableCell>
        {/* <TableCell align="right">{row.instructor}</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, width: '100%' }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Stock Info
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Color</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.stock && row.stock.length > 0 && (
                    row.stock.map((content) => (
                      <TableRow key={content._id}>
                        <TableCell component="th" scope="row">
                          {content.color}
                        </TableCell>
                        <TableCell>{content.size}</TableCell>
                        <TableCell align="right">
                          {content.quantity}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
            {
              row.courseContents && row.courseContents.length == 0 ? (
                <div className="table-placeholder">
                  No Data Available
                </div>
              ) : (
                <div></div>
              )
            }
            {/* <div className="collapsible-table__controls">
              <button className="add-content" onClick={() => { loadContents(row._id) }}>
                <FaPlus /> &nbsp;
                Add New Content
              </button>
            </div> */}
            <div className="collapsible-table__controls">
              <Button className='collapsible-control__item delete' variant="contained" onClick={() => { deleteCourse(row.id) }}>Delete</Button>
              <Button className='collapsible-control__item update' variant="contained" onClick={() => { loadEditModal(row.id) }}>Update</Button>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default Product;
