import Fab from '@mui/material/Fab'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IoMdEye } from "react-icons/io";

export const renderActionButtons = (rowData, loadEditData, handleDelete, loadInfoData) => (
    <div className="action-buttons">
      <Fab onClick={() => loadEditData(rowData.id)} color="primary" size="small"><EditIcon sx={{ width: 15, height: 15 }} /></Fab>
      &nbsp;
      <Fab onClick={() => handleDelete(rowData.id)} color="secondary" size="small"><DeleteIcon sx={{ width: 15, height: 15 }} /></Fab>
      &nbsp;
      <Fab onClick={() => loadInfoData(rowData.id)} color="info" size="small"><IoMdEye sx={{ width: 15, height: 15 }} /></Fab>
    </div>
  );