import React, { useState, useContext } from 'react';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import Lawyer_SideBar from '../../../components/LawyerProfile_SideBar/Lawyer_SideBar';
import styles from './surviceListingLawyer.module.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { UserContext } from '../../../hooks/UserContext';

const SurviceListingLawyer = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const userid = user?.id;
  const username = user?.name;
  const useremail = user?.email;

  const paid = localStorage.getItem('paid');
  if (paid === 'false') {
    Swal.fire(
      'Problem!',
      'You have to pay the subscription fee first!',
      'error'
    ).then(() => {
      navigate("/lawyer/lsubscription");
    });
  }

  const [imageItem, setImageItem] = useState("");
  const [lawyerDetails, setLawyerDetails] = useState({
    name: username,
    email: useremail,
    contactNumber: "",
    address: "",
    image: "",
    education: "",
    experience: "",
    languages: "",
    courts: "",
    specialization: "",
    userID: userid
  });

  const [values, setValues] = useState({
    name: username,
    email: useremail,
    contactNumber: '',
    address: '',
    experience: "",
    education: '',
    languages: '',
    courts: '',
    specialization: '',
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Upload image to Firebase and get URL
      const storageRef = ref(storage, `lawyer/${v4()}`);
      try {
        await uploadBytes(storageRef, imageItem);
        const imageUrl = await getDownloadURL(storageRef);

        // Send new lawyer details to the backend
        const newLawyer = {
          ...lawyerDetails,
          image: imageUrl
        };

        await axios.post("http://localhost:7070/api/lawyer/", newLawyer);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Service Listing Added Successfully!'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/lawyer");
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: null });
    setLawyerDetails({ ...lawyerDetails, [name]: value });
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(values.name)) {
      errors.name = 'Name should contain only letters and spaces';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    }
    if (!values.contactNumber) {
      errors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(values.contactNumber)) {
      errors.contactNumber = 'Contact number should contain exactly 10 digits';
    }
    if (!values.address) {
      errors.address = 'Address is required';
    }
    if (!values.courts) {
      errors.courts = 'Courts is required';
    }
    return errors;
  };

  //end
  return (
    <div>
      <Navbar />
      <div className={styles.master}>
        <div className={styles.profile_home}>
          <Lawyer_SideBar />
          <div className={styles.main_card}>
            <div className={styles.subcard}>
              {/* start coding */}
              <div className={styles.newUser}>
                <div className={styles.newUserTitle}><b>Survice Listing Form</b></div>
                <div className={styles.newUsersubTitle}><b>Hi!! Do you want to publish your service?</b></div>
                <form className={styles.newUserForm} onSubmit={handleSubmit} >
                  <div className={styles.newUserRow}>
                    <div className={styles.newUserItem}>
                      <label>Name</label>
                      <input type="text" placeholder="Enter Name" name="name" value={lawyerDetails.name} onChange={handleInputChange} />
                      {errors.name &&
                        <p style={{ color: "red", fontSize: "13px" }}>
                          {errors.name}
                        </p>
                      }
                    </div>
                    <div className={styles.newUserItem}>
                      <label>Email</label>
                      <input type="email" placeholder="Enter Email" name="email" value={lawyerDetails.email} onChange={handleInputChange} />
                      {errors.email &&
                        <p style={{ color: "red", fontSize: "13px" }}>
                          {errors.email}
                        </p>
                      }
                    </div>

                  </div>

                  <div className={styles.newUserRow}>

                    <div className={styles.newUserItem}>
                      <label>Contact Number</label>
                      <input type="text" placeholder="+1 123 456 78" name="contactNumber" value={lawyerDetails.contactNumber} onChange={handleInputChange} />
                      {errors.contactNumber &&
                        <p style={{ color: "red", fontSize: "13px" }}>
                          {errors.contactNumber}
                        </p>
                      }
                    </div>
                    <div className={styles.newUserItem}>
                      <label>Address</label>
                      <input type="text" placeholder="Enter Address" name="address" value={lawyerDetails.address} onChange={handleInputChange} />
                      {errors.address &&
                        <p style={{ color: "red", fontSize: "13px" }}>
                          {errors.address}
                        </p>

                      }
                    </div>
                  </div>

                  <div className={styles.newUserRow}>
                    <div className={styles.newUserItem}>

                      <label>Upload Image</label>
                      <input
                        type="file"
                        id="image"
                        onChange={(e) => setImageItem(e.target.files[0])} />
                    </div>

                    <div className={styles.newUserItem}>
                      <label>Education</label>
                      <input type="text" placeholder="Enter Education Details" name="education" onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className={styles.newUserRow}>
                    <div className={styles.newUserItem}>
                      <label>Experience</label>
                      <input type="text" placeholder="Enter Experience Years" name="experience" onChange={handleInputChange} />
                    </div>

                    <div className={styles.newUserItem}>
                      <label>Languages</label>
                      <input type="text" placeholder="Enter known Languages" name="languages" onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className={styles.newUserRow}>
                    <div className={styles.newUserItem}>
                      <label>Practice Courts</label>
                      <input type="text" placeholder="Enter Practice Courts" name="courts" onChange={handleInputChange} />
                      {errors.courts &&
                        <p style={{ color: "red", fontSize: "13px" }}>
                          {errors.courts}
                        </p>

                      }
                    </div>


                    <div className={styles.newUserItem}>
                      <label>Specialization</label>
                      <input type="text" placeholder="Enter Specialization" name="specialization" onChange={handleInputChange} />
                    </div>
                  </div>
                  <button className={styles.newUserButton}>Submit</button>
                </form>
              </div>



              {/* end coding */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SurviceListingLawyer

