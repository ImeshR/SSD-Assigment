import React, { useState, useContext } from "react";
import styles from "./customer_Privacy.module.css";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import Navigator from "../../../components/Customer_Profile/profile_nav/Profile_nav";
import Info_Card from "../../../components/Customer_Profile/info_card/Info_card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from 'sweetalert2';
import { UserContext } from "../../../hooks/UserContext";  // Import UserContext

const Customer_Privacy = () => {
  const [isConfirmFormVisible, setConfirmFormVisible] = useState(false);
  const { userId } = useContext(UserContext);  // Extract the userid from UserContext

  const handleConfirmFormVisibility = () => {
    setConfirmFormVisible(!isConfirmFormVisible);
  };

  const HandleDelete = () => {
    axios
      .delete(`http://localhost:7070/api/customer/delete_customer/${userId}`)
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Account Deleted Successfully!'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";
          }
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while deleting your account. Please try again.'
        });
      });
  };

  return (
    <div>
      <Navbar />
      <div className={styles.master}>
        <Navigator />
        <div className={styles.profile_home}>
          <Info_Card />
          <div className={styles.main_card}>
            <div className={styles.title}>
              <h1>Privacy & Policy</h1>
            </div>
            <div className={styles.privacy_content}>
              <div className={styles._45}>
                <div className={styles._50}>
                  <span>Delete Your Account</span>
                  <div className={styles.down}>
                    <h1>Delete your account permanently</h1>
                  </div>
                </div>
              </div>
              <div className={styles._46}>
                <button onClick={handleConfirmFormVisibility}>Delete Account</button>
              </div>
            </div>
            {/* Form to get deletion confirmation */}
            {isConfirmFormVisible && (
              <div className={styles.form}>
                <div className={styles.mark}>
                  <div className={styles.mark_content}>
                    <FontAwesomeIcon icon={faExclamation} style={{ color: "#cc8925" }} />
                  </div>
                </div>
                <div className={styles.Container}>
                  <div className={styles.text}>
                    <span>
                      Are you sure you want to delete your account? This will permanently delete your account, and you can't recover it again.
                    </span>
                  </div>
                  <div className={styles.btncontainer}>
                    <button className={styles.yes} onClick={HandleDelete}>Yes, Delete</button>
                    <button className={styles.no} onClick={handleConfirmFormVisibility}>No, Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Customer_Privacy;
