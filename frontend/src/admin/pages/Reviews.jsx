import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import '../styles/Shared.css';

// Icons and Imported Components
import Fab from '@mui/material/Fab'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IoMdEye } from "react-icons/io";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import { CSSTransition } from 'react-transition-group';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const retrieveReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/product/all`);
            setReviews(res.data.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        retrieveReviews();
    }, []);

    const onRowClick = (rowData) => {
        navigate(`/admin/crud/reviews/${rowData._id}`);
    };

    return (
        <div className="main-container__admin">
            <div className="container sub-container__single-lg">
                <div className="container-body">
                    <DataTable
                        value={reviews}
                        style={{ width: '100%' }}
                        rows={10}
                        responsive="true"
                        selectionMode="single"
                        onRowClick={(e) => onRowClick(e.data)}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    >
                        <Column field="_id" header="ID" style={{ width: '50%' }}></Column>
                        <Column field="title" header="Title" style={{ width: '25%' }}></Column>
                        <Column field="reviews.length" header="Reviews Count" style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>
                <div className="container-footer" style={{ padding: '16px' }}>
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
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
                </div>
            </div>
        </div>
    );
};

export default Reviews;
