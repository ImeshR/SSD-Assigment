import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import validation from "./Validation";
import { UserContext } from "../../hooks/UserContext";
import Swal from "sweetalert2";
import Loader from "../shared/loader";
import axios from "axios";

const Login = () => {
  const { login, loginWithGoogle } = useContext(UserContext);
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const role = await login(values.email, values.password);
        setIsLoading(false);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User Logged In Successfully!",
        }).then(() => {
          navigateBasedOnRole(role);
        });
      } catch (error) {
        setIsLoading(false);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Login failed",
          "error"
        );
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const role = await loginWithGoogle();
      setIsGoogleLoading(false);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Google Login Successful!",
      }).then(() => {
        navigateBasedOnRole(role);
      });
    } catch (error) {
      setIsGoogleLoading(false);
      Swal.fire("Error", "Google login failed", "error");
    }
  };

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case "Regular User":
        navigate("/customer");
        break;
      case "Vehicle Owner":
        navigate("/vehicleOwner");
        break;
      case "Showroom Owner":
        navigate("/showroomOwner");
        break;
      case "Landlord":
        navigate("/landlord");
        break;
      case "Lawyer":
        navigate("/lawyer");
        break;
      case "Site Owner":
        navigate("/siteOwner");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit}>
        <div className={styles.mainContainer}>
          <div className={styles.imageContainer}></div>
          <div className={styles.loginContainer}>
            <div className={styles.inner}>
              <div className={styles.form_head}>
                <div className={styles.title}>Login</div>
                <span className={styles.subtitle}>Don't have an account? </span>
                <a href='/signup' className='text-blue-800 underline'>
                  Create today!
                </a>
              </div>

              <div className={styles.form_groupmain}>
                <div className={styles.group}>
                  <div className={styles.label_text}>Email</div>
                  <input
                    value={values.email}
                    name='email'
                    type='email'
                    className={styles.form_control}
                    placeholder='Enter email'
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className={styles.group}>
                  <div className={styles.label_text}>Password</div>
                  <input
                    value={values.password}
                    name='password'
                    type='password'
                    className={styles.form_control}
                    placeholder='Password'
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className={styles.form_button}>
                  <div className={styles.check_action}>
                    <input type='checkbox' name='remember' />
                    <label>Remember me</label>
                  </div>
                  <a href='#' className={styles.link}>
                    Forgot Password?
                  </a>
                </div>

                <button
                  type='submit'
                  className={`bg-blue-500 w-full text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50`}
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                <br />
                <div className={styles.googleLoginContainer}>
                  <button
                    onClick={handleGoogleLogin}
                    className={`bg-gray-800 text-white w-full py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50`}
                    disabled={isGoogleLoading}
                  >
                    {isGoogleLoading ? "Logging in..." : "Login with Google"}
                  </button>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
