import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../AuthContext';

const ProductReview = () => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState()
    const { id } = useParams()
    const retrieveInfo = async() => {
        try {
            const res = await axios.get(`http://localhost:8000/api/product/${id}`)
            setReviews(res.data.data.reviews)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteReview = async(user) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/product/delete/${id}/${user}`)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        retrieveInfo()
    }, [])
  return (
    <div className="main-container__admin">
      <table>
        <tbody>
          {
            reviews ? (
              reviews.map((review, index) => {
                return(
                  <tr>
                    <td>{review.review}</td>
                    <td>{review.rating}</td>
                    <td onClick={() => {deleteReview(review.userId)}}><button>Delete</button></td>
                  </tr>
                )
              })
            ) : (
              null
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default ProductReview