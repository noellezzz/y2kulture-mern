import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Typography, Box, Collapse } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const retrieveUsers = async () => {
        const response = await axios.get('http://localhost:8000/api/user');
        setUsers(response.data.data);
    };

    const handleCreateUser = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/user', currentUser);
            setUsers([...users, response.data]);
            setIsModalOpen(false);
            setCurrentUser({ first_name: '', last_name: '', email: '' });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleEditUser = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8000/api/user/${id}`, currentUser);
            setUsers(users.map((user) => (user._id === id ? response.data : user)));
            setIsEditing(false);
            setIsModalOpen(false);
            setCurrentUser({ first_name: '', last_name: '', email: '' });
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/user/${id}`);
            setUsers(users.filter((user) => user._id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    useEffect(() => {
        retrieveUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    const openEditModal = (user) => {
        setIsEditing(true);
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setCurrentUser({ first_name: '', last_name: '', email: '' });
        setIsModalOpen(true);
    };

    return (
        <div>
            <h1>Users</h1>
            <Button variant="contained" onClick={openCreateModal}>Add User</Button>
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
                                    <IconButton onClick={() => openEditModal(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteUser(user._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit User' : 'Add User'}</h2>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={currentUser.first_name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={currentUser.last_name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={currentUser.email}
                            onChange={handleInputChange}
                        />
                        <Button
                            variant="contained"
                            onClick={isEditing ? () => handleEditUser(currentUser._id) : handleCreateUser}
                        >
                            {isEditing ? 'Update User' : 'Create User'}
                        </Button>
                        <Button variant="contained" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
