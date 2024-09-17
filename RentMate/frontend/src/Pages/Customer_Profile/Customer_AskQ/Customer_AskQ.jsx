import React, { useState, useContext } from "react";
import styles from "./customer_AskQ.module.css";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import Navigator from "../../../components/Customer_Profile/profile_nav/Profile_nav";
import Info_Card from "../../../components/Customer_Profile/info_card/Info_card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { UserContext } from "../../../hooks/UserContext"; 

const Customer_AskQ = ({ onSubmit, vehicleToEdit }) => {
  const { user } = useContext(UserContext);
  const username = user?.name;
  const useremail = user?.email;
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState({
    name: username,
    email: useremail,
    contactNumber: "",
    date: "",
    problemtype: "Payment",
    problem: "",
    userID: user?.id || "", // Get user ID from context
    status: "Pending"
  });

  const [values, setValues] = useState({
    name: username,
    email: useremail,
    contactNumber: '',
    date: '',
    problemtype: 'Payment',
    problem: '',
    userID: user?.id || "", // Get user ID from context
    status: "Pending"
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log(formDetails);

      await axios.post("http://localhost:7070/api/problems/", formDetails)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => console.log(error));

      Swal.fire({
        icon: 'success',
        title: 'Done!',
        text: 'Your Question has been submitted!',
        footer: 'Please wait for 3/4 working days for the answer.'
      });

      navigate('/customer/question');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: null });
    setFormDetails({ ...formDetails, [event.target.name]: event.target.value });
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    } else if (!/^[a-zA-Z]+$/.test(values.name)) {
      errors.name = 'Name should contain only letters';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    }
    if (!values.contactNumber) {
      errors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(values.contactNumber)) {
      errors.contactNumber = 'Contact number should contain exactly 10 numbers';
    }
    if (!values.date) {
      errors.date = 'Date is required';
    }
    if (!values.problem) {
      errors.problem = 'Problem is required';
    }
    return errors;
  };

  return (
    <div>
      <Navbar />
      <div className={styles.master}>
        <Navigator />
        <div className={styles.profile_home}>
          <Info_Card />
          <div className={styles.main_card}>
            <div className={styles.boxform}>
              <div className={styles.newUserTitle}><b>Support Form</b></div>
              <div className={styles.newUsersubTitle}><b>Hi!! Do you want to help?</b></div>
              <form onSubmit={handleSubmit} className={styles.newUserForm}>
                <div className={styles.newUserRow}>
                  <div className={styles.newUserItem}>
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formDetails.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className={styles.error_message}>{errors.name}</span>}
                  </div>

                  <div className={styles.newUserItem}>
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formDetails.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className={styles.error_message}>{errors.email}</span>}
                  </div>
                </div>

                <div className={styles.newUserRow}>
                  <div className={styles.newUserItem}>
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formDetails.contactNumber}
                      onChange={handleInputChange}
                      className={errors.contactNumber ? 'error' : ''}
                    />
                    {errors.contactNumber && <span className={styles.error_message}>{errors.contactNumber}</span>}
                  </div>

                  <div className={styles.newUserItem}>
                    <label htmlFor="date">Date:</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formDetails.date}
                      onChange={handleInputChange}
                      className={errors.date ? 'error' : ''}
                    />
                    {errors.date && <span className={styles.error_message}>{errors.date}</span>}
                  </div>
                </div>

                <div className={styles.newUserRow}>
                  <div className={styles.newUserItem}>
                    <label htmlFor="categray">What Kind of Problem:</label>
                    <select
                      name="problemtype"
                      value={formDetails.problemtype}
                      onChange={handleInputChange}
                      className={errors.categray ? 'error' : ''}
                    >
                      <option value="Payment">Payment</option>
                      <option value="Registration">Registration</option>
                      <option value="SignUp">SignUp</option>
                      <option value="SignIn">SignIn</option>
                      <option value="Lawyer">Lawyer</option>
                      <option value="LandLoard">LandLoard</option>
                      <option value="Vehicle">Vehicle</option>
                    </select>
                    {errors.categray && <span className={styles.error_message}>{errors.categray}</span>}
                  </div>

                  <div className={styles.newUserItem}>
                    <label htmlFor="problem">Problem:</label>
                    <textarea
                      id="problem"
                      rows="4"
                      cols="50"
                      name="problem"
                      value={formDetails.problem}
                      onChange={handleInputChange}
                      className={errors.problem ? 'error' : ''}
                    />
                    {errors.problem && <span className={styles.error_message}>{errors.problem}</span>}
                  </div>
                </div>

                <button className={styles.newUserButton}>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Customer_AskQ;
