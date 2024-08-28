"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Modal from "./Modal"; // Import the Modal component
import { Operator } from "@/types";

const OperatorForm = () => {
  const [operator, setOperator] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [operatorList, setOperatorList] = useState<Operator[]>([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await axios.get("/api/operators");
        setOperatorList(response.data);
      } catch (error) {
        console.error("Failed to fetch operators:", error);
      }
    };

    fetchOperators();
  }, []);

  const handleRegisterModalClose = () => {
    setIsRegisterModalOpen(false);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setIsEditMode(false);
    setSelectedOperator(null);
  };

  const handleView = (operator: Operator) => {
    setSelectedOperator(operator);
    setIsViewModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleArchive = async (operator: Operator) => {
    const confirmArchive = confirm(
      `Are you sure you want to archive ${operator.firstname} ${operator.lastname}?`
    );
    if (confirmArchive) {
      try {
        await axios.delete(`/api/operators`, { data: { id: operator.id } });
        alert("Operator archived successfully");
        setOperatorList((prev) =>
          prev.filter((op) => op.id !== operator.id)
        );
      } catch (error) {
        alert("Failed to archive operator");
      }
    }
  };

  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const index = parseInt(name);
    setOperator((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/operators", {
        firstname: operator[0],
        middlename: operator[1],
        lastname: operator[2],
        license_no: operator[3],
        contact: operator[4],
        region: operator[5],
        city: operator[6],
        brgy: operator[7],
        street: operator[8],
      });
      alert("Operator registered successfully");
      setOperator(["", "", "", "", "", "", "", "", ""]);
      const response = await axios.get("/api/operators");
      setOperatorList(response.data);
      handleRegisterModalClose(); // Close the modal after successful submission
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert("License number already registered");
        } else {
          alert("Failed to register operator");
        }
      }
      
    }
  };

  const handleViewChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (selectedOperator) {
      const { name, value } = e.target;
      setSelectedOperator((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleViewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedOperator) return;

    try {
      await axios.put(`/api/operators/${selectedOperator.id}`, selectedOperator);
      alert("Operator updated successfully");
      const response = await axios.get("/api/operators");
      setOperatorList(response.data);
      handleViewModalClose(); // Close the modal after successful update
    } catch (error) {
      alert("Failed to update operator");
    }
  };

  return (
    <div>
      <button onClick={() => setIsRegisterModalOpen(true)}>
        Register New Operator
      </button>

      {/* Register Modal */}
      <Modal isOpen={isRegisterModalOpen} onClose={handleRegisterModalClose}>
        <form onSubmit={handleRegisterSubmit}>
          <h3>Register Operator</h3>
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="0"
              value={operator[0]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Middle Name</label>
            <input
              type="text"
              name="1"
              value={operator[1]}
              onChange={handleRegisterChange}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="2"
              value={operator[2]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>License No</label>
            <input
              type="text"
              name="3"
              value={operator[3]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Contact</label>
            <input
              type="text"
              name="4"
              value={operator[4]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Region</label>
            <input
              type="text"
              name="5"
              value={operator[5]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>City</label>
            <input
              type="text"
              name="6"
              value={operator[6]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Brgy</label>
            <input
              type="text"
              name="7"
              value={operator[7]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Street</label>
            <input
              type="text"
              name="8"
              value={operator[8]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <button type="submit">Register Operator</button>
        </form>
      </Modal>

      <h2>Registered Operators</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>License No</th>
            <th>Contact</th>
            <th>Region</th>
            <th>City</th>
            <th>Brgy</th>
            <th>Street</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {operatorList.map((op, index) => (
            <tr key={index}>
              <td>{op.firstname}</td>
              <td>{op.middlename}</td>
              <td>{op.lastname}</td>
              <td>{op.license_no}</td>
              <td>{op.contact}</td>
              <td>{op.region}</td>
              <td>{op.city}</td>
              <td>{op.brgy}</td>
              <td>{op.street}</td>
              <td>
                <button onClick={() => handleView(op)}>View</button>
                <button onClick={() => handleArchive(op)}>Archive</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View/Edit Modal */}
      {isViewModalOpen && selectedOperator && (
        <Modal isOpen={isViewModalOpen} onClose={handleViewModalClose}>
          {!isEditMode ? (
            <div>
              <h3>View Operator</h3>
              <p>
                <strong>First Name:</strong> {selectedOperator.firstname}
              </p>
              <p>
                <strong>Middle Name:</strong> {selectedOperator.middlename}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedOperator.lastname}
              </p>
              <p>
                <strong>License No:</strong> {selectedOperator.license_no}
              </p>
              <p>
                <strong>Contact:</strong> {selectedOperator.contact}
              </p>
              <p>
                <strong>Region:</strong> {selectedOperator.region}
              </p>
              <p>
                <strong>City:</strong> {selectedOperator.city}
              </p>
              <p>
                <strong>Brgy:</strong> {selectedOperator.brgy}
              </p>
              <p>
                <strong>Street:</strong> {selectedOperator.street}
              </p>
              <button onClick={handleEdit}>Edit</button>
            </div>
          ) : (
            <form onSubmit={handleViewSubmit}>
              <h3>Edit Operator</h3>
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={selectedOperator.firstname}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Middle Name</label>
                <input
                  type="text"
                  name="middlename"
                  value={selectedOperator.middlename}
                  onChange={handleViewChange}
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={selectedOperator.lastname}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>License No</label>
                <input
                  type="text"
                  name="license_no"
                  value={selectedOperator.license_no}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={selectedOperator.contact}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Region</label>
                <input
                  type="text"
                  name="region"
                  value={selectedOperator.region}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={selectedOperator.city}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Brgy</label>
                <input
                  type="text"
                  name="brgy"
                  value={selectedOperator.brgy}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={selectedOperator.street}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <button type="submit">Update Operator</button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default OperatorForm;
