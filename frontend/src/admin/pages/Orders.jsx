import React, { useEffect, useState } from 'react'
import { fetchData } from '../utils/crudUtils'

// MUI

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';

import '../styles/Orders.css'
import axios from 'axios'

const Orders = () => {
  const [tempData, setTempData] = useState()
  const [orderList, setOrderList] = useState([])
  const [open, setOpen] = React.useState(false);

  const retrieveData = async () => {
    try {
      await fetchData('user', setTempData)

    } catch (e) {
      console.log("Error fetching Data:", e)
    }
  }

  const filterData = async (dataList) => {
    setOrderList([])

    if (Array.isArray(dataList)) {
      dataList.forEach((row) => {
        console.log(row)
        if (row.checkout && row.checkout.length > 0) {
          row.checkout.forEach((order) => {
            const newData = {
              userId: row._id,
              id: order._id,
              datePlaced: order.order.datePlaced,
              address: order.order.shippingDetails,
              status: order.order.status,
              cost: order.order.total_cost,
              items: order.order.items,
            };

            setOrderList((prevList) => [...prevList, newData]);
          });
        }
      });
    }

    console.log(orderList)
  }

  useEffect(() => {
    retrieveData()
  }, [])

  useEffect(() => {
    // console.log(orderData)
    filterData(tempData)
  }, [tempData])
  return (
    <div className="main-container__admin">
      <div className="container sub-container__single-lg">
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell sx={{
                  minWidth: '300px',
                  // border: '1px solid #000',
                }}>Date Placed</TableCell>
                <TableCell sx={{
                  width: '150px',
                  // border: '1px solid #000',
                }} align="right">Order ID</TableCell>
                <TableCell sx={{
                  width: '150px',
                  // border: '1px solid #000',
                }} align="right">Address</TableCell>
                <TableCell sx={{
                  width: '150px',
                  // border: '1px solid #000',
                }} align="right">Cost</TableCell>
                <TableCell sx={{
                  width: '200px',
                  // border: '1px solid #000',
                }} align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderList.map((row) => (
                <Row key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const handleUpdate = async (mode, userId, orderId) => {
    try {
      const form = {
        userId,
        orderId,
        mode,
      };
      const res = await axios.post(`http://localhost:8000/api/user/update/stock`, form)
    } catch (e) {
      console.log(e)
    }
  }

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
        <TableCell component="th" scope="row">
          {row.datePlaced}
        </TableCell>
        <TableCell align="right">{row.id}</TableCell>
        <TableCell align="right">{row.address}</TableCell>
        <TableCell align="right">{row.cost}</TableCell>
        <TableCell align="right"><span className={`status-span ${row.status === 'Pending' ? 'pending-status' :
          row.status === 'Shipped' ? 'shipped-status' :
            row.status === 'Delivered' ? 'delivered-status' :
              row.status === 'Cancelled' ? 'cancelled-status' :
                ''
          }`}>{row.status}</span></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Variant</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.items.map((historyRow) => (
                    <TableRow key={historyRow.stockId}>
                      <TableCell component="th" scope="row">
                        {historyRow.productId}
                      </TableCell>
                      <TableCell>{historyRow.quantity}</TableCell>
                      <TableCell align="right">{historyRow.color}, {historyRow.size}</TableCell>
                      <TableCell align="right">
                        {historyRow.quantity}
                        {/* {Math.round(historyRow.amount * row.price * 100) / 100} */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="controls-collapsed">
                <Button variant="contained" className='invert-button pending-button'
                  onClick={() => { handleUpdate('Shipped', row.userId, row.id) }}
                >Set Pending
                </Button>
                <Button variant="contained" className='invert-button shipped-button'
                  onClick={() => { handleUpdate('Shipped', row.userId, row.id) }}
                >Set Shipped
                </Button>
                <Button variant="contained" className='invert-button delivered-button'
                  onClick={() => { handleUpdate('Delivered', row.userId, row.id) }}
                >Set Delivered
                </Button>
                <Button variant="contained" className='invert-button cancelled-button'
                  onClick={() => { handleUpdate('Cancelled', row.userId, row.id) }}
                >Set Cancelled
                </Button>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


export default Orders