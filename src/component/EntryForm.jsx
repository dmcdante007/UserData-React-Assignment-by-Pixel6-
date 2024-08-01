import React, { useState, useRef, useEffect } from "react";
import "./EntryForm.css";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, addUser, deleteUser, updateUser } from "./store/userData";
import UserModal from "./UserModal";
import axios from "axios";
import loadingGif from "../assets/load4.gif";

const API_ENDPOINT =
  "We can enter any api link here ";

const EntryForm = () => {
  // ===================================Required variables, states and refs============================================
  const dispatch = useDispatch();
  const users = useSelector((state) => state.userData.users) || [];
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [panNum, setPanNum] = useState(null);
  const [pincode, setPinCode] = useState(null);
  const [apiFullName, setApiFullname] = useState(null);
  const [apiStateName, setApiStatename] = useState(null);
  const [apiCityName, setApiCityname] = useState(null);
  const [view, setView] = useState(false);
  const panRef = useRef(null);
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const addressLine1Ref = useRef(null);
  const addressLine2Ref = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const postcodeRef = useRef(null);

  // ================================UseEffect to check and verify the panNumber=============================================
  useEffect(() => {
    const timeoutID = setTimeout(async () => {
      if (panNum && panNum.length === 10) {
        console.log(panNum);
        try {
          // const user = JSON.parse(`{"panNumber": "${panNum}"}`);
          const valid = await axios.post(
            "https://lab.pixel6.co/api/verify-pan.php",
            { panNumber: panNum }
          );

          console.log(valid.data);
          if (valid.data.isValid) {
            setApiFullname(valid.data.fullName);
          } else {
            setApiFullname("");
          }
        } catch (err) {
          console.log(err);
        }
      }
    }, 2000);

    return () => clearTimeout(timeoutID);
  }, [panNum]);

  //  ------------------------------------UseEffect to check and verify the Pincode----------------------------------
  useEffect(() => {
    const timeoutID2 = setTimeout(async () => {
      if (pincode && pincode.length === 6) {
        setView(true);
        console.log(pincode);
        try {
          // const user = JSON.parse(`{"postcode": "${pincode}"}`);
          const valid = await axios.post(
            "https://lab.pixel6.co/api/get-postcode-details.php",
            { postcode: pincode }
          );
          setApiCityname(valid.data.city[0].name);
          console.log(valid.data);
          setApiStatename(valid.data.state[0].name);
        } catch (err) {
          console.log(err);
        } finally {
          setView(false);
        }
      }
    }, 2000);

    return () => clearTimeout(timeoutID2);
  }, [pincode]);

  // -----------------------------------------Get user from API on initial render--------------------------------------------
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/data`);
      dispatch(setUsers(response.data));
      console.log(users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  // =====================================On Submit handler Function=================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      id: Math.random(),
      pan: panRef.current.value,
      fullName: fullNameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      addressLine1: addressLine1Ref.current.value,
      addressLine2: addressLine2Ref.current.value,
      state: stateRef.current.value,
      city: cityRef.current.value,
      postcode: postcodeRef.current.value,
    };
    try {
      const response = await axios.post(`${API_ENDPOINT}/data`, formData);
      const newUser = await response.data;
      dispatch(addUser(newUser));
      setCurrentUser(newUser);
      setShowModal(true);
      // console.log(newUser)                     Check if the api call is working
      // console.log(users)                       Check if the data is being added and fetched from Redux

      panRef.current.value = ""; // Clear the form
      fullNameRef.current.value = "";
      emailRef.current.value = "";
      phoneRef.current.value = "";
      addressLine1Ref.current.value = "";
      addressLine2Ref.current.value = "";
      stateRef.current.value = "";
      cityRef.current.value = "";
      postcodeRef.current.value = "";
    } catch (error) {
      console.log("Failed to submit user", error);
    }
  };

  // =====================================Delete from API handler========================================
  const deleteFromModule = async (userID) => {
    try {
      const del = await axios.delete(`${API_ENDPOINT}/data/${userID}`);
      dispatch(deleteUser(userID));
      fetchUsers();
      console.log("success");
      //   fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // =============================================Handeling Updating of data===================================================
  const handleUpdate = async (each, upaddressLine1, upaddressLine2) => {
    try {
      const obj = {
        id: each.id,
        pan: each.pan,
        fullName: each.fullName,
        email: each.email,
        phone: each.phone,
        addressLine1: upaddressLine1,
        addressLine2: upaddressLine2,
        state: each.state,
        city: each.city,
        postcode: each.postcode,
      };
      console.log(obj);

      await axios.put(`${API_ENDPOINT}/data/${each._id}`, obj);
      dispatch(updateUser(obj));
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <>
      {/* =======================================Inputs and calls============================================ */}
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Enter User Data</h1>
          <div className="input-box">
            <input
              type="text"
              name="pan"
              placeholder="Enter your 10 digit-PAN"
              maxLength={10}
              ref={panRef}
              onChange={(e) => setPanNum(e.target.value)}
              required
            />
            <span>
              {view && (
                <img src={loadingGif} alt="My Image" className="loader" />
              )}
            </span>
          </div>
          <div className="input-box">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              maxLength={140}
              ref={fullNameRef}
              value={apiFullName}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="E-mail ID"
              maxLength={255}
              ref={emailRef}
              required
            />
          </div>
          <div className="input-box phone-box">
            <span className="prefix">+91</span>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              maxLength={10}
              ref={phoneRef}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1"
              ref={addressLine1Ref}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2"
              ref={addressLine2Ref}
            />
          </div>
          <div className="input-box-row">
            <input
              type="text"
              name="state"
              placeholder="State"
              ref={stateRef}
              value={apiStateName}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={apiCityName}
              ref={cityRef}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="postcode"
              placeholder="Postcode"
              onChange={(e) => {
                setPinCode(e.target.value);
              }}
              maxLength={6}
              ref={postcodeRef}
            />
            <span>
              {view && (
                <img src={loadingGif} alt="My Image" className="loader" />
              )}
            </span>
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button
            type="button"
            className="submit-button"
            onClick={() => setShowModal(!showModal)}
          >
            Entered Data
          </button>
        </form>
      </div>
      {/* ==========================Modal popup========================================== */}
      {showModal && (
        <UserModal
          user={users}
          onClose={() => setShowModal(false)}
          onDelete={deleteFromModule}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default EntryForm;
