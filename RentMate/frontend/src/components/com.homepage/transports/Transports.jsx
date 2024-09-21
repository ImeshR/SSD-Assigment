import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../com.style/homepage.module.css";
import axios from "axios";
import axiosRetry from "axios-retry"; 

const Transports = () => {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Configure axios to retry requests with exponential backoff
  axiosRetry(axios, {
    retries: 3, // Number of retry attempts
    retryDelay: (retryCount) => {
      return retryCount * 1000; // Time between retries increases with each attempt (1000ms, 2000ms, etc.)
    },
    retryCondition: (error) => {
      // Retry on network errors or 5xx server errors
      return error.response.status >= 500 || error.code === 'ECONNABORTED';
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:7070/api/vehi/get/random');
        setTransports(res.data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (err) {
        setError("An error occurred while fetching data.");
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Display error message if fetching fails
  }

  return (
    <div>
      <div className={styles.content}>
        <div className={styles.navigation}>
          <div className={styles.servicename}>
            <i className="bx bxs-truck"></i>
            <span>Transports</span>
          </div>
          <div className={styles.viewall}>
            <Link to="/transports" className={styles.link}>
              View All
            </Link>
          </div>
        </div>
        <div className={styles.cards}>
          <div className={styles.row}>
            {transports.length > 0 ? (
              transports.map((transport) => (
                <div className={styles.column} key={transport._id}>
                  <div className={styles.imageview}>
                    <Link to={`/vehicle/${transport._id}`} className={styles.link}>
                      <img
                        src="https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?cs=srgb&dl=pexels-mikebirdy-116675.jpg&fm=jpg"
                        alt={transport.name}
                        style={{ width: "340px", height: "250px" }}
                      />
                    </Link>
                  </div>
                  <div >
                    <Link to={`/vehicle/${transport._id}`} className={styles.link}>
                      <span>{transport.name}</span>
                    </Link>
                    <div className={styles.price}>Rs. {transport.price}/Km</div>
                  </div>
                </div>
              ))
            ) : (
              <div>No transport data available.</div> // Message when no data is found
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transports;
