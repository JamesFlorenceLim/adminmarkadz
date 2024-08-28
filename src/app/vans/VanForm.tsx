"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Modal from "./Modal"; // Import the Modal component
import { Van } from "@/types";

const VanForm = () => {
  const [van, setVan] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
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
  const [vanList, setVanList] = useState<Van[]>([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Dropdown options
  const fuelOptions = ["Diesel", "Gasoline", "Electric", "Hybrid"];
  const makeOptions = ["Toyota", "Ford", "Honda", "Chevrolet"];
  const bodyTypeOptions = ["Van", "Truck", "Sedan", "SUV"];
  const denominationOptions = ["1.5L", "2.0L", "2.5L", "3.0L"];
  const pistonDisplacementOptions = ["1000cc", "1500cc", "2000cc", "2500cc"];

  useEffect(() => {
    const fetchVans = async () => {
      try {
        const response = await axios.get("/api/vans");
        setVanList(response.data);
      } catch (error) {
        console.error("Failed to fetch vans:", error);
      }
    };

    fetchVans();
  }, []);

  const handleRegisterModalClose = () => {
    setIsRegisterModalOpen(false);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setIsEditMode(false);
    setSelectedVan(null);
  };

  const handleView = (van: Van) => {
    setSelectedVan(van);
    setIsViewModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleArchive = async (van: Van) => {
    const confirmArchive = confirm(
      `Are you sure you want to archive van with Plate Number ${van.plate_number}?`
    );
    if (confirmArchive) {
      try {
        await axios.delete(`/api/vans`, { data: { id: van.id } });
        alert("Van archived successfully");
        setVanList((prev) => prev.filter((v) => v.id !== van.id));
      } catch (error) {
        alert("Failed to archive van");
      }
    }
  };

  const handleRegisterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const index = parseInt(name);
    setVan((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/vans", {
        mv_file_no: van[0],
        plate_number: van[1],
        engine_no: van[2],
        chassis_no: van[3],
        denomination: van[4],
        piston_displacement: van[5],
        number_of_cylinders: van[6],
        fuel: van[7],
        make: van[8],
        series: van[9],
        body_type: van[10],
        body_no: van[11],
        year_model: van[12],
        gross_weight: van[13],
        net_weight: van[14],
        shipping_weight: van[15],
        net_capacity: van[16],
        year_last_registered: van[17],
        expiration_date: van[18],
      });
      alert("Van registered successfully");
      setVan([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
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
      const response = await axios.get("/api/vans");
      setVanList(response.data);
      handleRegisterModalClose(); // Close the modal after successful submission
    } catch (error) {
      alert("Failed to register van");
    }
  };

  const handleViewChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    if (selectedVan) {
      const { name, value } = e.target;
      setSelectedVan((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleViewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedVan) return;

    try {
      await axios.put(`/api/vans/${selectedVan.id}`, selectedVan);
      alert("Van updated successfully");
      const response = await axios.get("/api/vans");
      setVanList(response.data);
      handleViewModalClose(); // Close the modal after successful update
    } catch (error) {
      alert("Failed to update van");
    }
  };

  return (
    <div>
      <button onClick={() => setIsRegisterModalOpen(true)}>
        Register New Van
      </button>

      {/* Register Modal */}
      <Modal isOpen={isRegisterModalOpen} onClose={handleRegisterModalClose}>
        <form onSubmit={handleRegisterSubmit}>
          <h3>Register Van</h3>
          <div>
            <label>MV File No</label>
            <input
              type="text"
              name="0"
              value={van[0]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Plate Number</label>
            <input
              type="text"
              name="1"
              value={van[1]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Engine No</label>
            <input
              type="text"
              name="2"
              value={van[2]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Chassis No</label>
            <input
              type="text"
              name="3"
              value={van[3]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Denomination</label>
            <select
              name="4"
              value={van[4]}
              onChange={handleRegisterChange}
              required
            >
              <option value="">Select Denomination</option>
              {denominationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Piston Displacement</label>
            <select
              name="5"
              value={van[5]}
              onChange={handleRegisterChange}
              required
            >
              <option value="">Select Piston Displacement</option>
              {pistonDisplacementOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Number of Cylinders</label>
            <input
              type="text"
              name="6"
              value={van[6]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Fuel</label>
            <select
              name="7"
              value={van[7]}
              onChange={handleRegisterChange}
              required
            >
              <option value="">Select Fuel</option>
              {fuelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Make</label>
            <select
              name="8"
              value={van[8]}
              onChange={handleRegisterChange}
              required
            >
              <option value="">Select Make</option>
              {makeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Series</label>
            <input
              type="text"
              name="9"
              value={van[9]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Body Type</label>
            <select
              name="10"
              value={van[10]}
              onChange={handleRegisterChange}
              required
            >
              <option value="">Select Body Type</option>
              {bodyTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Body No</label>
            <input
              type="text"
              name="11"
              value={van[11]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Year Model</label>
            <input
              type="text"
              name="12"
              value={van[12]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Gross Weight</label>
            <input
              type="text"
              name="13"
              value={van[13]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Net Weight</label>
            <input
              type="text"
              name="14"
              value={van[14]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Shipping Weight</label>
            <input
              type="text"
              name="15"
              value={van[15]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Net Capacity</label>
            <input
              type="text"
              name="16"
              value={van[16]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Year Last Registered</label>
            <input
              type="text"
              name="17"
              value={van[17]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div>
            <label>Expiration Date</label>
            <input
              type="text"
              name="18"
              value={van[18]}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <button type="submit">Register Van</button>
        </form>
      </Modal>

      <h2>Registered Vans</h2>
      <table>
        <thead>
          <tr>
            <th>MV File No</th>
            <th>Plate Number</th>
            <th>Engine No</th>
            <th>Chassis No</th>
            <th>Denomination</th>
            <th>Piston Displacement</th>
            <th>Number of Cylinders</th>
            <th>Fuel</th>
            <th>Make</th>
            <th>Series</th>
            <th>Body Type</th>
            <th>Body No</th>
            <th>Year Model</th>
            <th>Gross Weight</th>
            <th>Net Weight</th>
            <th>Shipping Weight</th>
            <th>Net Capacity</th>
            <th>Year Last Registered</th>
            <th>Expiration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vanList.map((v, index) => (
            <tr key={index}>
              <td>{v.mv_file_no}</td>
              <td>{v.plate_number}</td>
              <td>{v.engine_no}</td>
              <td>{v.chassis_no}</td>
              <td>{v.denomination}</td>
              <td>{v.piston_displacement}</td>
              <td>{v.number_of_cylinders}</td>
              <td>{v.fuel}</td>
              <td>{v.make}</td>
              <td>{v.series}</td>
              <td>{v.body_type}</td>
              <td>{v.body_no}</td>
              <td>{v.year_model}</td>
              <td>{v.gross_weight}</td>
              <td>{v.net_weight}</td>
              <td>{v.shipping_weight}</td>
              <td>{v.net_capacity}</td>
              <td>{v.year_last_registered}</td>
              <td>{v.expiration_date}</td>
              <td>
                <button onClick={() => handleView(v)}>View</button>
                <button onClick={() => handleArchive(v)}>Archive</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View/Edit Modal */}
      {isViewModalOpen && selectedVan && (
        <Modal isOpen={isViewModalOpen} onClose={handleViewModalClose}>
          {!isEditMode ? (
            <div>
              <h3>View Van</h3>
              <p>
                <strong>MV File No:</strong> {selectedVan.mv_file_no}
              </p>
              <p>
                <strong>Plate Number:</strong> {selectedVan.plate_number}
              </p>
              <p>
                <strong>Engine No:</strong> {selectedVan.engine_no}
              </p>
              <p>
                <strong>Chassis No:</strong> {selectedVan.chassis_no}
              </p>
              <p>
                <strong>Denomination:</strong> {selectedVan.denomination}
              </p>
              <p>
                <strong>Piston Displacement:</strong>{" "}
                {selectedVan.piston_displacement}
              </p>
              <p>
                <strong>Number of Cylinders:</strong>{" "}
                {selectedVan.number_of_cylinders}
              </p>
              <p>
                <strong>Fuel:</strong> {selectedVan.fuel}
              </p>
              <p>
                <strong>Make:</strong> {selectedVan.make}
              </p>
              <p>
                <strong>Series:</strong> {selectedVan.series}
              </p>
              <p>
                <strong>Body Type:</strong> {selectedVan.body_type}
              </p>
              <p>
                <strong>Body No:</strong> {selectedVan.body_no}
              </p>
              <p>
                <strong>Year Model:</strong> {selectedVan.year_model}
              </p>
              <p>
                <strong>Gross Weight:</strong> {selectedVan.gross_weight}
              </p>
              <p>
                <strong>Net Weight:</strong> {selectedVan.net_weight}
              </p>
              <p>
                <strong>Shipping Weight:</strong> {selectedVan.shipping_weight}
              </p>
              <p>
                <strong>Net Capacity:</strong> {selectedVan.net_capacity}
              </p>
              <p>
                <strong>Year Last Registered:</strong>{" "}
                {selectedVan.year_last_registered}
              </p>
              <p>
                <strong>Expiration Date:</strong> {selectedVan.expiration_date}
              </p>
              <button onClick={handleEdit}>Edit</button>
            </div>
          ) : (
            <form onSubmit={handleViewSubmit}>
              <h3>Edit Van</h3>
              <div>
                <label>MV File No</label>
                <input
                  type="text"
                  name="mv_file_no"
                  value={selectedVan.mv_file_no}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Plate Number</label>
                <input
                  type="text"
                  name="plate_number"
                  value={selectedVan.plate_number}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Engine No</label>
                <input
                  type="text"
                  name="engine_no"
                  value={selectedVan.engine_no}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Chassis No</label>
                <input
                  type="text"
                  name="chassis_no"
                  value={selectedVan.chassis_no}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Denomination</label>
                <select
                  name="denomination"
                  value={selectedVan.denomination}
                  onChange={handleViewChange}
                  required
                >
                  {denominationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Piston Displacement</label>
                <select
                  name="piston_displacement"
                  value={selectedVan.piston_displacement}
                  onChange={handleViewChange}
                  required
                >
                  {pistonDisplacementOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Number of Cylinders</label>
                <input
                  type="text"
                  name="number_of_cylinders"
                  value={selectedVan.number_of_cylinders}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Fuel</label>
                <select
                  name="fuel"
                  value={selectedVan.fuel}
                  onChange={handleViewChange}
                  required
                >
                  {fuelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Make</label>
                <select
                  name="make"
                  value={selectedVan.make}
                  onChange={handleViewChange}
                  required
                >
                  {makeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Series</label>
                <input
                  type="text"
                  name="series"
                  value={selectedVan.series}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Body Type</label>
                <select
                  name="body_type"
                  value={selectedVan.body_type}
                  onChange={handleViewChange}
                  required
                >
                  {bodyTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Body No</label>
                <input
                  type="text"
                  name="body_no"
                  value={selectedVan.body_no}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Year Model</label>
                <input
                  type="text"
                  name="year_model"
                  value={selectedVan.year_model}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Gross Weight</label>
                <input
                  type="text"
                  name="gross_weight"
                  value={selectedVan.gross_weight}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Net Weight</label>
                <input
                  type="text"
                  name="net_weight"
                  value={selectedVan.net_weight}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Shipping Weight</label>
                <input
                  type="text"
                  name="shipping_weight"
                  value={selectedVan.shipping_weight}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Net Capacity</label>
                <input
                  type="text"
                  name="net_capacity"
                  value={selectedVan.net_capacity}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Year Last Registered</label>
                <input
                  type="text"
                  name="year_last_registered"
                  value={selectedVan.year_last_registered}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <div>
                <label>Expiration Date</label>
                <input
                  type="text"
                  name="expiration_date"
                  value={selectedVan.expiration_date}
                  onChange={handleViewChange}
                  required
                />
              </div>
              <button type="submit">Update Van</button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default VanForm;
