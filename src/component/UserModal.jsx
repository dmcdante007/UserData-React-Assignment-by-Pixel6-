import React, { useState } from "react";
import "./UserModal.css";

const UserModal = ({ user, onClose, onDelete, onUpdate }) => {
  const [editedAddress1, setEditedAddress1] = useState("");
  const [editedAddress2, setEditedAddress2] = useState("");

  const handleSaveClick = (id) => {
    onUpdate(id, editedAddress1, editedAddress2);
  };

  return (
    <div className="modal-outer">
      <div className="modal-inner">
        <h2>User Details</h2>


{/* =======================================Handleing the Users data in modal================================================ */}
        <ul>
          {user.length === 0 ? (
            <p>Please enter a User detail</p>
          ) : (
            user.slice(0, 10).map((each) => (
              <li key={each._id}>
                <span>{each.fullName} </span>
                <span className="edit-input">
                  <input
                    type="text"
                    value={editedAddress1}
                    placeholder={each.addressLine1}
                    onChange={(e) => setEditedAddress1(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editedAddress2}
                    placeholder={each.addressLine2}
                    onChange={(e) => setEditedAddress2(e.target.value)}
                  />
                </span>
                <span>
                  <button
                    style={{ marginRight: "20px" }}
                    onClick={() => handleSaveClick(each)}
                  >
                    Edit
                  </button>
                  <button onClick={() => onDelete(each._id)}>Del</button>
                </span>
              </li>
            ))
          )}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
      <div></div>
    </div>
  );
};

export default UserModal;
