import React, { useState, useContext } from "react";
import styles from "./customer_Security.module.css";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import Navigator from "../../../components/Customer_Profile/profile_nav/Profile_nav";
import Info_Card from "../../../components/Customer_Profile/info_card/Info_card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../../../hooks/UserContext";  // Hook integration

const Customer_Security = () => {
  const { user } = useContext(UserContext);  // Access user details from context
  const [isPasswordFormVisible, setNameFormVisible] = useState(false);
  const [passwordcontainer, setPassword] = useState("");

  const handlePasswordFormVisibility = () => {
    setNameFormVisible(!isPasswordFormVisible);
  };

  const handlepassword = (event) => {
    setPassword({
      ...passwordcontainer,
      password: event.target.value,
    });
  };

  function validatePassword(password) {
    if (password.length < 8) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;

    return true;
  }

  // handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();

    axios.put(`http://localhost:7070/api/customer/updatepassword/${user.id}`, {
      password: passwordcontainer.password,
    })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Successfully!",
        }).then(() => {
          window.location = "http://localhost:3000/login";
        });
      })
      .catch((err) => {
        Swal.fire("Error", "Check your inserted Details", "error");
      });

    handlePasswordFormVisibility();
  };

  function checkPasswordsMatch() {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword === confirmPassword) {
      const isValid = validatePassword(newPassword);
      if (isValid) {
        Swal.fire({
          icon: "success",
          title: "Password is valid!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Password is invalid!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }
  


  return (
    <div>
      <Navbar />
      <div className={styles.master}>
        <Navigator />
        <div className={styles.profile_home}>
          <Info_Card />
          <div className={styles.main_card}>
            <div className={styles.title}>
              <h1>Login & Security</h1>
            </div>
            <div className={styles.container}>
              <div className={styles.layer1}>
                <div className={styles.box}>
                  <section>
                    <div className={styles.name}>
                      <h1>Login</h1>
                    </div>
                    <div className={styles.login_content}>
                      <div className={styles._45}>
                        <div className={styles._50}>
                          <span>Password</span>
                          <div className={styles.down}>
                            <h1>Use Strong Password </h1>
                          </div>
                        </div>
                      </div>
                      <div className={styles._46}>
                        <button onClick={handlePasswordFormVisibility}>
                          Update
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* form for update password */}
                  {isPasswordFormVisible && (
                    <div className={styles.form1}>
                      <div className={styles.formContainer}>
                        <form onSubmit={handleSubmit}>
                          <div className={styles.content2}>
                            <label htmlFor="new password">New Password</label>
                              <div className={styles.inputBox}>
                                <input type="password" id="newPassword" placeholder=" New Password" onKeyUp={checkPasswordsMatch} onChange={handlepassword} required/>
                              </div>
                          </div>
                          <div className={styles.content2}>
                            <label htmlFor="new password">Confirmation Password</label>
                              <div className={styles.inputBox}>
                                <input type="password" id="confirmPassword" placeholder=" Confirmation Password" onKeyUp={checkPasswordsMatch} required/>
                              </div>
                          </div>
                          <button type="submit" id="submitButton">Update</button>
                        </form>
                      </div>
                      <div className={styles.closeBtn}>
                        <FontAwesomeIcon
                          className={styles.close}
                          onClick={handlePasswordFormVisibility}
                          icon={faXmark}
                        />
                      </div>
                    </div>
                  )}

                  {/* Social Login */}
                  <section>
                    <div className={styles.name}>
                      <h1> Social Login</h1>
                    </div>
                    <div className={styles.login_content}>
                      <div className={styles._45}>
                        <div className={styles._50}>
                          <span>Google</span>
                          <div className={styles.down}>
                            <h1>Connected</h1>
                          </div>
                        </div>
                      </div>
                      <div className={styles._46}>
                        <button>
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
              <div className={styles.layer2}></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Customer_Security;
