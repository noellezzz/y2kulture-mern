import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users from API
  const retrieveUsers = async () => {
    const response = await axios.get('http://localhost:8000/api/user');
    setUsers(response.data.data);
  };

  // Handle user creation
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

  // Handle user update
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

  // Handle user delete
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
      <button onClick={openCreateModal}>Add User</button>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => openEditModal(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit User */}
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
            <button
              onClick={isEditing ? () => handleEditUser(currentUser._id) : handleCreateUser}
            >
              {isEditing ? 'Update User' : 'Create User'}
            </button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
