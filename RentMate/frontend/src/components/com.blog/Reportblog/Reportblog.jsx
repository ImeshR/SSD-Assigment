import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Tag } from "primereact/tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAmericas,
  faLocationCrosshairs,
  faMobileScreen,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./reportblog.module.css";
import styless from "../../../Pages/Main_Dashboard/BlogManagement/BlogList.jsx";
import DOMPurify from "dompurify"; // Import DOMPurify to sanitize user input
import Login from "../../../components/navbar/images/RentMate.png";

const Reportblog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blog, setBlog] = useState([]);

  // Fetch blog data securely
  useEffect(() => {
    function getBlog() {
      axios
        .get("http://localhost:8080/api/blog/")
        .then((res) => {
          setBlog(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getBlog();
  }, []);

  // Sanitize the data before rendering to prevent XSS
  const sanitize = (data) => DOMPurify.sanitize(data);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const pickStatus = (status) => {
    if (status.toLowerCase() === "active") {
      return (
        <Tag
          className={styless.status__btn}
          icon="pi pi-check"
          severity="success"
          value="Active"
        />
      );
    } else {
      return (
        <Tag
          className={styless.status__btn}
          icon="pi pi-info-circle"
          severity="warning"
          value="Pending"
        />
      );
    }
  };

  const filteredData = blog.filter((data) => {
    const searchTerms = searchTerm.toLowerCase().split(" ");
    const dataInfo =
      `${data.title} ${data.idNo} ${data.date} ${data.image} `.toLowerCase();
    return searchTerms.every((term) => dataInfo.includes(term));
  });

  return (
    <div>
      <div className={styles.contentbody}>
        <div className={styles.CReportpage_header}>
          <div className={styles.layer1}>
            <div className={styles.CReportpage_logo}>
              <div className={styles.CReportpage_logo_container}>
                <img src={Login} alt="site-logo" />
                <div className={styles.CReportpage_logo_container_sitename}>
                  <span className={styles.sitename}>RentMate</span>
                </div>
              </div>
            </div>

            <div className={styles.right_container}>
              <div className={styles.container_right}>
                <div className={styles.lay1}>
                  <div className={styles.data}>
                    <span>077-XXXXXXX</span>
                    <span>076-XXXXXXX</span>
                  </div>
                  <div className={styles.data_icon}>
                    <FontAwesomeIcon
                      icon={faMobileScreen}
                      style={{
                        color: "#ffffff",
                        width: "20px",
                        height: "20px",
                        margin: "0 auto",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.lay1}>
                  <div className={styles.data}>
                    <span>WWW.rentmate.com</span>
                    <span>rentmatehelpdesk@gmail.com</span>
                  </div>
                  <div className={styles.data_icon}>
                    <FontAwesomeIcon
                      icon={faEarthAmericas}
                      style={{
                        color: "#ffffff",
                        width: "20px",
                        height: "20px",
                        margin: "0 auto",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.lay1}>
                  <div className={styles.data}>
                    <span>
                      Pasan Mawatha,Weliwita <br />
                      Sri lanka
                    </span>
                  </div>
                  <div className={styles.data_icon}>
                    <FontAwesomeIcon
                      icon={faLocationCrosshairs}
                      style={{
                        color: "#ffffff",
                        width: "20px",
                        height: "20px",
                        margin: "0 auto",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog List Section */}
        <div className={styless.tablearea__content}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Id</th>
                <th>Content</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data) => (
                <tr key={data.id}>
                  <td>{sanitize(data.title)}</td>
                  <td>{sanitize(data.idNo)}</td>
                  <td>{sanitize(data.content)}</td>
                  <td>{sanitize(data.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportblog;
