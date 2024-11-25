import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ProductReview = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const { isAuthenticated } = useAuth();

  const retrieveInfo = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/product/${id}`);
      setReviews(res.data.data.reviews);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReview = async (userId) => {
    try {
      await axios.post(`http://localhost:8000/api/product/delete/${id}/${userId}`);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.userId !== userId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    retrieveInfo();
  }, []);

  const deleteButtonTemplate = (rowData) => (
    <Button
      variant="contained"
      color="error"
      size="small"
      startIcon={<DeleteIcon />}
      onClick={() => deleteReview(rowData.userId)}
    >
      Delete
    </Button>
  );

  return (
    <div className="main-container__admin" style={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ padding: '16px', maxWidth: '100%', width: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: '16px', textAlign: 'center' }}>
          Product Reviews
        </Typography>
        <DataTable
          value={reviews}
          style={{ width: '100%' }} // Ensures the table spans the entire width
          scrollable // Enables scrolling if the content overflows
          scrollHeight="400px" // Optional: defines a fixed height for the table
          paginator // Adds pagination
          responsiveLayout="scroll"
          rows={10}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        >
          <Column field="review" header="Review" style={{ width: '50%' }} />
          <Column field="rating" header="Rating" style={{ width: '20%' }} />
          <Column
            header="Actions"
            body={deleteButtonTemplate}
            style={{ width: '30%' }}
          />
        </DataTable>
      </Box>
    </div>
  );
};

export default ProductReview;
