import React from "react";
import styles from "../../components/com.style/missing.module.css";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div>
      <div className={styles.page404}>
        <div>
          <div className={styles.errormsg}>
            <h1>Unauthorized</h1>
            <p>You do not have permission to view this page.</p>
          </div>
          <Link
            to="/"
            className={styles.link}
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
