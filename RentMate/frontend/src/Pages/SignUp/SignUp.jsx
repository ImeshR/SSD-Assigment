import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import stylesss from "./signUp.module.css";
import Validation from "./Validation";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/loader";
const SignUp = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [values, setValues] = useState({
    fname: "",
    lname: "",
    username: "",
    email: "",
    contactNumber: "",
    password: "",
    confirm_password: "",
    type: "Regular User",
  });

  const [errors, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = Validation(values);
    setError(validation);

    if (Object.keys(validation).length === 0) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:7070/api/auth/register",
          {
            username: values.username,
            email: values.email,
            password: values.password,
            type: values.type,
          }
        );
        console.log(response.data);
        setIsLoading(false);
        Swal.fire({
          icon: "success",
          title: "Done!!",
          text: "New User Created Successfully!",
          footer: '<a href="/login">You can login now</a>',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      } catch (error) {
        console.error("Signup error:", error);
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Check your email or password again!",
        });
      }
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <Toast ref={toast} />
      <div className={stylesss.mainContainer1}>
        <div className={stylesss.imageContainer1}></div>
        <div className={stylesss.loginContainer1}>
          <div className={stylesss.newUser}>
            <div className={stylesss.newUserTitle}>
              <b>Sign Up</b>
            </div>
            <form className={stylesss.newUserForm} onSubmit={handleSubmit}>
              <div className={stylesss.newUserRow}>
                <div className={stylesss.newUserItem1}>
                  <label>First Name</label>
                  <input
                    type='text'
                    placeholder='Enter Name'
                    name='fname'
                    value={values.fname}
                    onChange={handleChange}
                  />
                  {errors.fname && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {errors.fname}
                    </p>
                  )}
                </div>
                <div className={stylesss.newUserItem1}>
                  <label>Last Name</label>
                  <input
                    type='text'
                    placeholder='Enter Name'
                    name='lname'
                    value={values.lname}
                    onChange={handleChange}
                  />
                  {errors.lname && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {errors.lname}
                    </p>
                  )}
                </div>
              </div>
              <div className={stylesss.newUserRow}>
                <div className={stylesss.newUserItem1}>
                  <label>Email</label>
                  <input
                    type='email'
                    placeholder='Enter Email'
                    name='email'
                    value={values.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className={stylesss.newUserItem1}>
                  <label>Contact Number</label>
                  <input
                    type='text'
                    placeholder='+1 123 456 78'
                    name='contactNumber'
                    value={values.contactNumber}
                    onChange={handleChange}
                  />
                  {errors.contactNumber && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {errors.contactNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className={stylesss.newUserRow}>
                <div className={stylesss.newUserItem1}>
                  <label>Select Role</label>
                  <select
                    name='type'
                    value={values.type}
                    className={stylesss.selectRoll}
                    onChange={handleChange}
                  >
                    <option value='Regular User'>Regular User</option>
                    <option value='Landlord'>Landlord</option>
                    <option value='Vehicle Owner'>Vehicle Owner</option>
                    <option value='Showroom Owner'>Showroom Owner</option>
                    <option value='Lawyer'>Lawyer</option>
                  </select>
                </div>

                <div className={stylesss.newUserItem1}>
                  <label>Username</label>
                  <input
                    type='text'
                    placeholder='Enter Username'
                    name='username'
                    value={values.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>
              <div className={stylesss.newUserRow}>
                <div className={stylesss.newUserItem1}>
                  <label>Password</label>
                  <input
                    type='password'
                    placeholder='Password'
                    name='password'
                    value={values.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className={stylesss.newUserItem1}>
                  <label>Confirm Password</label>
                  <input
                    type='password'
                    placeholder='Confirm Password'
                    name='confirm_password'
                    onChange={handleChange}
                  />
                  {errors.confirm_password && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {errors.confirm_password}
                    </p>
                  )}
                </div>
              </div>
              <button className={stylesss.newUserButton}>Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
