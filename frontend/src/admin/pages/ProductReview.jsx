import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import '../styles/Shared.css';

const ProductReview = () => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();

  const retrieveInfo = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/product/${id}`);
      setReviews(res.data.data.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReview = async (userId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/product/delete/${id}/${userId}`);
      console.log(res.data);
      retrieveInfo(); // Refresh the reviews after deletion
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieveInfo();
  }, []);

  const actionBodyTemplate = (rowData) => {
    return (
      <Button variant="contained" color="secondary" onClick={() => deleteReview(rowData.userId)}>
        Delete
      </Button>
    );
  };

  return (
    <div className="main-container__admin">
      <div className="container sub-container__single-lg">
        <div className="container-body">
          <DataTable value={reviews} style={{ width: '100%' }} rows={10} responsive="true">
            <Column field="review" header="Review" style={{ width: '50%' }}></Column>
            <Column field="rating" header="Rating" style={{ width: '25%' }}></Column>
            <Column body={actionBodyTemplate} header="Actions" style={{ width: '25%' }}></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;