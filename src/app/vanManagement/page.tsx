// src/app/vanManagement/page.tsx
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Van, QueuedVan } from '../../types';

const VanManagement = () => {
  const [idleVans, setIdleVans] = useState<Van[]>([]);
  const [queuedVans, setQueuedVans] = useState<QueuedVan[]>([]);

  useEffect(() => {
    fetchIdleVans();
    fetchQueuedVans();
  }, []);

  const fetchIdleVans = async () => {
    try {
      const response = await axios.get<Van[]>('/api/assignedVans');
      setIdleVans(response.data);
    } catch (error) {
      console.error('Error fetching idle vans', error);
    }
  };

  const fetchQueuedVans = async () => {
    try {
      const response = await axios.get<QueuedVan[]>('/api/queuedVans');
      setQueuedVans(response.data);
    } catch (error) {
      console.error('Error fetching queued vans', error);
    }
  };

  const queueVan = async (vanId: number) => {
    try {
      await axios.post('/api/queueVan', { vanId });
      fetchIdleVans();
      fetchQueuedVans();
    } catch (error) {
      console.error('Error queuing van', error);
    }
  };

  const updateVanStatus = async (vanId: number, status: string) => {
    try {
      await axios.post('/api/updateVanStatus', { vanId, status });
      fetchIdleVans();
      fetchQueuedVans();
    } catch (error) {
      console.error('Error updating van status', error);
    }
  };

  return (
    <div>
      <h1>Van Management</h1>
      <h2>Idle Vans</h2>
      <ul>
        {idleVans.map(van => (
          <li key={van.id}>
            {van.plate_number} - {van.firstname} {van.lastname}
            <button onClick={() => queueVan(van.id)}>Queue</button>
          </li>
        ))}
      </ul>

      <h2>Queued Vans</h2>
      <ul>
        {queuedVans.map(van => (
          <li key={van.id}>
            {van.plate_number} - {van.firstname} {van.lastname}
            <button onClick={() => updateVanStatus(van.id, 'waiting')}>Waiting</button>
            <button onClick={() => updateVanStatus(van.id, 'departed')}>Departed</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VanManagement;
