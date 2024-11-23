import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Button,
    Fab,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IoMdEye } from "react-icons/io";
import { CSSTransition } from "react-transition-group";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../styles/Shared.css";

// Utils
import { fetchData, createFunc, addToTable, updateFunc, addAndRemoveToTable, deleteFunc } from '../utils/crudUtils';
import { db } from '../../auth/firebase';  // Import Firestore db
import { setDoc, doc } from "firebase/firestore";  // Firestore methods

const Users = () => {
    const [users, setUsers] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "user",
        status: "active",
        birthday: "",
        gender: "",
        contact_number: "",
        address: [],
        avatar: [],
        deleted: false,
    });
    
    const [formState, setFormState] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "user",
        status: "active",
        birthday: "",
        gender: "",
        contact_number: "",
        address: [],
        avatar: [],
        deleted: false,
    });

    // Fetch users data
    useEffect(() => {
        const retrieveUsers = async () => {
            const response = await axios.get("http://localhost:8000/api/user");
            setUsers(response.data.data.filter(user => !user.deleted));
        };
        retrieveUsers();
    }, []);

    // Open Create User Modal
    const loadModalCreate = () => {
        setFormState({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            role: "user",
            status: "active",
            birthday: "",
            gender: "",
            contact_number: "",
            address: [],
            avatar: [],
            deleted: false,
        });
        setOpenModal(true);
    };

    // Open Edit User Modal
    const loadDataById = (user) => {
        setFormState(user);
        setEditModal(true);
    };

    // Handle Create User Submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            // Create the user in your backend
            const response = await createFunc("user", formState);
            
            // Create the new user object
            const newUser = {
                first_name: formState.first_name,
                last_name: formState.last_name,
                email: formState.email,
                password: formState.password,
                contact_number: formState.contact_number,
                role: formState.role,
                status: formState.status,
                birthday: formState.birthday,
                gender: formState.gender,
                address: formState.address,  // Ensure the address array is correctly formatted
                avatar: formState.avatar,
                deleted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Add the new user to Firestore (using their backend _id for document id)
            await setDoc(doc(db, "users", response.data.data._id), newUser);

            // After creating the user in the backend and Firebase, update the local state
            const userToAdd = {
                ...newUser,
                _id: response.data.data._id,
            };
            addToTable(setUsers, userToAdd);
            
            // Close the modal
            setOpenModal(false);
        } catch (error) {
            console.error("Error creating user:", error);
            alert("There was an error creating the user. Please try again.");
        }
    };

    // Handle Edit User Submit
    const handleUpdate = async () => {
        const response = await updateFunc("user", formState._id, formState);
        const updatedUser = {
            ...formState,
            _id: response.data.data._id,
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString(),
        };
        addAndRemoveToTable(setUsers, updatedUser);
        setEditModal(false);
    };

    // Handle Delete User
    const handleDelete = async (id) => {
        try {
            const userToUpdate = users.find(user => user._id === id);
            userToUpdate.deleted = true;
            await updateFunc("user", id, userToUpdate);
            setUsers(users.filter(user => user._id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("There was an error deleting the user. Please try again.");
        }
    };

    return (
        <div className="main-container__admin">
            <div className="container sub-container__single-lg">
                <div className="container-body">
                    <DataTable
                        value={users}
                        tableStyle={{ minWidth: "50rem" }}
                        scrollable
                        scrollHeight="290px"
                    >
                        <Column style={{ verticalAlign: "top" }} field="first_name" header="First Name" />
                        <Column style={{ verticalAlign: "top" }} field="last_name" header="Last Name" />
                        <Column style={{ verticalAlign: "top" }} field="email" header="Email" />
                        <Column style={{ verticalAlign: "top" }} field="role" header="Role" />
                        <Column style={{ verticalAlign: "top" }} field="status" header="Status" />
                        <Column style={{ verticalAlign: "top" }} field="createdAt" header="Created At" />
                        <Column style={{ verticalAlign: "top" }} field="updatedAt" header="Updated At" />
                        <Column
                            style={{ verticalAlign: "top" }}
                            field="controls"
                            header="Controls"
                            body={(rowData) => (
                                <>
                                    <Fab
                                        onClick={() => loadDataById(rowData)}
                                        color="primary"
                                        aria-label="edit"
                                        size="small"
                                        sx={{ zIndex: 0, width: 32, height: 32 }}
                                    >
                                        <EditIcon sx={{ width: 15, height: 15 }} />
                                    </Fab>
                                    &nbsp;
                                    <Fab
                                        onClick={() => handleDelete(rowData._id)}
                                        color="secondary"
                                        aria-label="delete"
                                        size="small"
                                        sx={{ zIndex: 0, width: 32, height: 32 }}
                                    >
                                        <DeleteIcon sx={{ width: 15, height: 15 }} />
                                    </Fab>
                                    &nbsp;
                                    <Fab
                                        onClick={() => {}}
                                        color="info"
                                        aria-label="info"
                                        size="small"
                                        sx={{ zIndex: 0, width: 32, height: 32 }}
                                    >
                                        <IoMdEye sx={{ width: 15, height: 15 }} />
                                    </Fab>
                                </>
                            )}
                        />
                    </DataTable>
                </div>

                <div className="container-footer">
                    <Button variant="contained" onClick={loadModalCreate}>
                        Create New User
                    </Button>

                    {/* Create Modal */}
                    <CSSTransition in={openModal} timeout={300} classNames="modal" unmountOnExit>
                        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
                            <DialogTitle>Create User</DialogTitle>
                            <DialogContent>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <TextField
                                        name="first_name"
                                        label="First Name"
                                        value={formState.first_name}
                                        onChange={(e) => setFormState({ ...formState, first_name: e.target.value })}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <TextField
                                        name="last_name"
                                        label="Last Name"
                                        value={formState.last_name}
                                        onChange={(e) => setFormState({ ...formState, last_name: e.target.value })}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <TextField
                                        name="email"
                                        label="Email"
                                        value={formState.email}
                                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <TextField
                                        name="password"
                                        label="Password"
                                        type="password"
                                        value={formState.password}
                                        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <TextField
                                        name="contact_number"
                                        label="Contact Number"
                                        value={formState.contact_number}
                                        onChange={(e) => setFormState({ ...formState, contact_number: e.target.value })}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            name="gender"
                                            value={formState.gender}
                                            onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                                            label="Gender"
                                        >
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            name="role"
                                            value={formState.role}
                                            onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                                            label="Role"
                                        >
                                            <MenuItem value="user">User</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="status"
                                            value={formState.status}
                                            onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                                            label="Status"
                                        >
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="inactive">Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    Create
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </CSSTransition>
                    
                    {/* Edit Modal */}
                    <CSSTransition in={editModal} timeout={300} classNames="modal" unmountOnExit>
                        <Dialog open={editModal} onClose={() => setEditModal(false)} fullWidth maxWidth="sm">
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogContent>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <TextField
                                        name="first_name"
                                        label="First Name"
                                        value={formState.first_name}
                                        onChange={(e) => setFormState({ ...formState, first_name: e.target.value })}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <TextField
                                        name="last_name"
                                        label="Last Name"
                                        value={formState.last_name}
                                        onChange={(e) => setFormState({ ...formState, last_name: e.target.value })}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <TextField
                                        name="email"
                                        label="Email"
                                        value={formState.email}
                                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <TextField
                                        name="contact_number"
                                        label="Contact Number"
                                        value={formState.contact_number}
                                        onChange={(e) => setFormState({ ...formState, contact_number: e.target.value })}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            name="role"
                                            value={formState.role}
                                            onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                                            label="Role"
                                        >
                                            <MenuItem value="user">User</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setEditModal(false)}>Cancel</Button>
                                <Button variant="contained" color="primary" onClick={handleUpdate}>
                                    Save Changes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </CSSTransition>
                </div>
            </div>
        </div>
    );
};

export default Users;
