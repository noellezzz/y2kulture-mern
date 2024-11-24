import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Reviews = () => {
  const [reviews, setReviews] = useState([])

  const retrieveReviews = async() => {
    try {
      const res = await axios.get(`http://localhost:8000/api/product/all`)
      console.log(res)
      setReviews(res.data.data)
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    retrieveReviews()
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
                    <td><Link to={`/admin/crud/reviews/${review._id}`}>{review.title}</Link></td>
                    <td>{review.reviews.length}</td>
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

export default Reviews