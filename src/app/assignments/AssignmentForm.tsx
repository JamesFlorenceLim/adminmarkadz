"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Operator, Van } from "@/types";

const AssignmentForm = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [vans, setVans] = useState<Van[]>([]);
  const [assignment, setAssignment] = useState({ van_id: 0, operator_id: 0 });

  useEffect(() => {
    const fetchOperators = async () => {
      const { data } = await axios.get("/api/operators");
      setOperators(data);
    };

    const fetchVans = async () => {
      const { data } = await axios.get("/api/vans");
      setVans(data);
    };

    fetchOperators();
    fetchVans();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssignment({ ...assignment, [name]: Number(value) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/assignments", assignment);
      setOperators((prevOperators) => [
        ...prevOperators,
        response.data.operator,
      ]);
      alert("Assignment created successfully");
      setAssignment({ van_id: 0, operator_id: 0 });
    } catch (error) {
      alert("Failed to create assignment");
    }
  };

  return (
    <>
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
        <button type="submit">Create Assignment</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Operator</th>
            <th>Van</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {operators.map((operator, index) => (
            <tr key={index}>
              <td>
                {operator.firstname} {operator.lastname}
              </td>
              <td>
                {vans.find((van) => van.id === assignment.van_id)?.plate_number}
              </td>
              <td>
                <button>View</button>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AssignmentForm;
