"use client"

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role_id, setRoleId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/register', { username, password, role_id });
      alert('User registered successfully');
      router.push('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Failed to register user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <div>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div>
        <label>Role ID</label>
        <input type="text" value={role_id} onChange={(e) => setRoleId(e.target.value)} required />
      </div>
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default RegisterPage;
