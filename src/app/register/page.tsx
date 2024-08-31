"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User } from '@/types'; // Adjust the import path based on your file structure

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role_id, setRoleId] = useState(''); // Initialize with an empty string
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]); // State to store the list of users
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State to control register modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control edit modal visibility
  const [isConfirmArchiveOpen, setIsConfirmArchiveOpen] = useState(false); // State to control confirmation dialog visibility
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State to store the user being edited
  const [userIdToArchive, setUserIdToArchive] = useState<number | null>(null); // State to store the ID of the user to be archived
  const router = useRouter();

  // Function to fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('/api/register'); // Adjust the endpoint if necessary
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('/api/register', { username, password, role_id });
      alert('User registered successfully');
      fetchUsers(); // Refresh the user list after a successful registration
      setIsRegisterModalOpen(false); // Close the modal
      //router.push('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Failed to register user');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await axios.put(`/api/register/${selectedUser.id}`, { username, password, role_id });
      alert('User updated successfully');
      fetchUsers(); // Refresh the user list after a successful update
      setIsEditModalOpen(false); // Close the edit modal
    } catch (error) {
      console.error('Error during update:', error);
      setError('Failed to update user');
    }
  };

  const handleArchiveUser = async (id: number) => {
    setUserIdToArchive(id); // Store the ID of the user to be archived
    setIsConfirmArchiveOpen(true); // Open the confirmation dialog
  };

  const confirmArchiveUser = async () => {
    if (userIdToArchive === null) return;

    try {
      // Perform the archive request
      const response = await axios.delete(`/api/register/${userIdToArchive}`, {
        data: { id: userIdToArchive } // Include data if needed by your server
      });

      // Check the response status
      if (response.status === 200) {
        alert('User archived successfully');
        fetchUsers(); // Refresh the user list after archiving
        setIsConfirmArchiveOpen(false); // Close the confirmation dialog
      } else {
        console.error('Unexpected response status:', response.status);
        setError('Failed to archive user');
      }
    } catch (error: any) {
      // Log error details
      console.error('Error during archive:', error.response?.data || error.message);
      setError('Failed to archive user');
    }
  };

  return (
    <>
      <h1>Registered Users</h1>
      <button onClick={() => setIsRegisterModalOpen(true)}>Register New User</button>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role_id === 1 ? 'Admin' : user.role_id === 2 ? 'User' : 'Unknown'}</td>
                <td>
                  <button onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}>Edit</button>
                  <button onClick={() => handleArchiveUser(user.id)}>Archive</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {isRegisterModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2>Register</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Role</label>
                <select
                  value={role_id}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="1">Admin</option>
                  <option value="2">User</option>
                </select>
              </div>
              <button type="submit">Register</button>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
              >
                Close
              </button>
              {error && <p>{error}</p>}
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2>Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label>Role</label>
                <select
                  value={role_id}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                >
                  <option value="1">Admin</option>
                  <option value="2">User</option>
                </select>
              </div>
              <button type="submit">Update</button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Close
              </button>
              {error && <p>{error}</p>}
            </form>
          </div>
        </div>
      )}

      {isConfirmArchiveOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2>Confirm Archive</h2>
            <p>Are you sure you want to archive this user?</p>
            <button onClick={confirmArchiveUser}>Yes</button>
            <button onClick={() => setIsConfirmArchiveOpen(false)}>No</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;
