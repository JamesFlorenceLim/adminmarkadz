"use client"


import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Import the Modal component
import { Operator, Van } from '@/types';

const AssignmentForm = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [vans, setVans] = useState<Van[]>([]);
  const [assignments, setAssignments] = useState([]);
  const [assignment, setAssignment] = useState({ id: null, van_id: 0, operator_id: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOperators = async () => {
      const { data } = await axios.get('/api/operators');
      setOperators(data);
    };

    const fetchVans = async () => {
      const { data } = await axios.get('/api/vans');
      setVans(data);
    };

    const fetchAssignments = async () => {
      const { data } = await axios.get('/api/assignments');
      setAssignments(data);
    };

    fetchOperators();
    fetchVans();
    fetchAssignments();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssignment({ ...assignment, [name]: Number(value) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && assignment.id) {
        await axios.put(`/api/assignments`, assignment);
        alert('Assignment updated successfully');
      } else {
        await axios.post('/api/assignments', assignment);
        alert('Assignment created successfully');
      }

      setAssignment({ id: null, van_id: 0, operator_id: 0 });
      setIsEditing(false);
      setIsModalOpen(false); // Close the modal after successful submission
      // Refresh assignments
      const { data } = await axios.get('/api/assignments');
      setAssignments(data);
    } catch (error) {
      alert('Failed to save assignment');
    }
  };

  const handleEdit = (id: number) => {
    const assignmentToEdit = assignments.find((assignment: any) => assignment.id === id);
    if (assignmentToEdit) {
      setAssignment(assignmentToEdit);
      setIsEditing(true);
      setIsModalOpen(true);
    } else {
      console.log('Assignment not found');
    }
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Add Assignment</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Operator</label>
            <select
              name="operator_id"
              value={assignment.operator_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Operator</option>
              {operators.map((operator) => (
                <option key={operator.id} value={operator.id}>
                  {operator.firstname} {operator.lastname}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Van</label>
            <select
              name="van_id"
              value={assignment.van_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Van</option>
              {vans.map((van) => (
                <option key={van.id} value={van.id}>
                  {van.plate_number}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">{isEditing ? 'Update Assignment' : 'Create Assignment'}</button>
        </form>
      </Modal>
      <table>
        <thead>
          <tr>
            <th>Operator</th>
            <th>Van</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment: any) => (
            <tr key={assignment.id}>
              <td>
                {operators.find((operator) => operator.id === assignment.operator_id)?.firstname} {operators.find((operator) => operator.id === assignment.operator_id)?.lastname}
              </td>
              <td>
                {vans.find((van) => van.id === assignment.van_id)?.plate_number}
              </td>
              <td>
                <button onClick={() => handleEdit(assignment.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AssignmentForm;
