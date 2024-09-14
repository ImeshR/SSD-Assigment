import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext"; // Import UserContext
import Login from "./images/RentMate.png";
import styles from "./navbar.module.css";

const Navbar = () => {
  const { user, logout } = useContext(UserContext); // Use UserContext

  // Debugging output
  console.log("User Context:", { user });

  const handleLogout = () => {
    logout(); // Call the logout function from UserContext
    window.location.href = "/"; // Redirect to home page after logout
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <Link to="/" className={styles.link}>
            <img src={Login} alt="site-logo" />
            <span className={styles.sitename}>RentMate</span>
          </Link>
        </div>
        <div className={styles.right}>
          {user ? (
            <button onClick={handleLogout} className={styles.link}>
              Logout
            </button>
          ) : (
            <>
              <button>
                <Link to="/signup" className={styles.link}>Signup</Link>
              </button>
              <button>
                <Link to="/login" className={styles.link}>Login</Link>
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
