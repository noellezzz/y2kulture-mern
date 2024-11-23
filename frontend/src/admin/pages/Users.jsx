import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import '../styles/Shared.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Retrieve users
  const retrieveUsers = async () => {
    const response = await axios.get("http://localhost:8000/api/user");
    setUsers(response.data.data);
  };

  // Handle create user
  const handleCreateUser = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/user", currentUser);
      setUsers([...users, response.data]); // Add the new user to the list
      setIsModalOpen(false); // Close the modal
      setCurrentUser({ first_name: "", last_name: "", email: "" }); // Reset form
    } catch (error) {
      console.error("Error creating user:", error); // Log error if creation fails
    }
  };

  // Handle edit user
  const handleEditUser = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/user/${id}`, currentUser);
      setUsers(users.map((user) => (user._id === id ? response.data : user)));
      setIsEditing(false);
      setIsModalOpen(false);
      setCurrentUser({ first_name: "", last_name: "", email: "" });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    retrieveUsers();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  // Open edit modal
  const openEditModal = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  // Open create modal
  const openCreateModal = () => {
    setIsEditing(false); // Set to create mode
    setCurrentUser({ first_name: "", last_name: "", email: "" }); // Reset the form fields
    setIsModalOpen(true); // Open the modal
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={openCreateModal}
        sx={{ marginBottom: "20px" }}
      >
        Add User
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => openEditModal(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteUser(user._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for creating/editing a user */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="first_name"
              label="First Name"
              value={currentUser.first_name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              name="last_name"
              label="Last Name"
              value={currentUser.last_name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              name="email"
              label="Email"
              value={currentUser.email}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              type="email"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={isEditing ? () => handleEditUser(currentUser._id) : handleCreateUser}
          >
            {isEditing ? "Update" : "Create"} {/* Conditional button text */}
          </Button>
          <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
