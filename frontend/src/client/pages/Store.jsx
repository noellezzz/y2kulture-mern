import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Store = () => {
  const [products, setProducts] = useState([]); // State to hold products
  const [loading, setLoading] = useState(true); // State to handle loading status
  const [error, setError] = useState(null); // State to handle API errors

  // Function to fetch products
  const getProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/product'); // Replace with your actual API endpoint
      console.log(response.data); // Log the response data to inspect it
      setProducts(response.data); // Assuming the API response returns an array of products
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Store</h1>
      <div className="products-grid">
        {Array.isArray(products) && products.map((products) => (
          <div key={products._id} className="product-card">
            <h2>{product.name}</h2>
            <p>{products.description}</p>
            <p><strong>Price:</strong> ${products.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
