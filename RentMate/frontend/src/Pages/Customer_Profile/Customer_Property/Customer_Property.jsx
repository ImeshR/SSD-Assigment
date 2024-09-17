import React, { useRef, useState, useEffect, useContext } from 'react';
import axios from "axios";
import styles from "./customer_Property.module.css";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import Navigator from "../../../components/Customer_Profile/profile_nav/Profile_nav";
import Info_Card from "../../../components/Customer_Profile/info_card/Info_card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Toast } from 'primereact/toast';
import Swal from 'sweetalert2';
import { UserContext } from "../../../hooks/UserContext"; // Import UserContext

const Customer_Property = () => {
    const { user, accessToken, logout } = useContext(UserContext); // Get user and accessToken
    const [isNameFormVisible, setNameFormVisible] = useState(false);
    const [isdelete, setdeletealert] = useState(false);
    const [isdataview, setdataview] = useState(false);
    const [allbookings, setallbookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [customerinfo, setCustomerinfo] = useState({});
    const [customerinfo2, setCustomerinfo2] = useState({});
    const [email, setEmail] = useState('');
    const [phone, setphone] = useState('');
    const [name, setname] = useState('');
    const [address, setaddress] = useState('');

    const toast = useRef(null);

    const getcustomerinfo = () => {
      if (!user || !accessToken) {
        return;
      }

      axios.get(`http://localhost:7070/api/customer/customer_info/${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          setCustomerinfo(res.data);
        })
        .catch((err) => {
          console.log(err);
          Swal.fire(
            'Error',
            'Could not fetch customer info',
            'error'
          );
        });
    };

    const updateCusdata = (id) => {
      if (!accessToken) {
        return;
      }

      setNameFormVisible(!isNameFormVisible);
      axios.put(`http://localhost:7070/api/customer/updatepropertybooking/${id}`, {
        cus_name: name,
        contactNo: phone,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          console.log(res.data);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Updated Successfully!',
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire(
            'Error',
            'Failed to update customer info',
            'error'
          );
        });
    };

    const handleNameFormVisibility = (booking) => {
      setNameFormVisible(!isNameFormVisible);
      setSelectedBooking(booking);
      getcustomerinfo();
    };

    const handleDalertVisibility = (id) => {
      if (!accessToken) {
        return;
      }

      axios.delete(`http://localhost:7070/api/customer/deletepropertybooking/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          console.log(res.data);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Deleted Successfully!',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire(
            'Error',
            'Failed to delete booking',
            'error'
          );
        });
    };

    const handleDataVisibility = (booking) => {
      setdataview(!isdataview);
      setSelectedBooking(booking);
    };

    useEffect(() => {
      if (!user || !accessToken) {
        return;
      }

      function getTodo() {
        axios.get(`http://localhost:7070/api/customer/getpropertybooking/${user.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res) => {
            setallbookings(res.data);
          })
          .catch((err) => {
            console.log(err);
            Swal.fire(
              'Error',
              'Failed to fetch bookings',
              'error'
            );
          });
      }
      getTodo();
    }, [user, accessToken]);

    return (
      <div>
        <Toast ref={toast} />
        <Navbar />
        <div className={styles.master}>
          <Navigator />
          <div className={styles.profile_home}>
            <Info_Card />
            <div className={styles.main_card}>
              <div className={styles.cp_container}>
                <div className={styles.cp_container_title}>
                  <span className={styles.cp_container_title_span}>All About Your Bookings</span>
                  <span className={styles.cp_container_title_span_sub1}>Manage your property booking here.</span>
                </div>
                <div className={styles.table_container_cp}>

                  {isNameFormVisible && selectedBooking && (
                    <div className={styles.formE}>
                      <div className={styles.closeBtn}>
                        <FontAwesomeIcon className={styles.close} onClick={handleNameFormVisibility} icon={faXmark} />
                      </div>
                      <div className={styles.form_cp_e}>
                        <form className={styles.form_cp}>
                          <div className={styles.input_container}>
                            <span className={styles.cp_span}>Customer Name:</span>
                            <input
                              placeholder={customerinfo.fname}
                              className={styles.cp_input}
                              onChange={(e) => setname(e.target.value)}
                            />
                          </div>
                          <div className={styles.input_container}>
                            <span className={styles.cp_span}>Customer Contact Number:</span>
                            <input
                              placeholder={customerinfo.phone}
                              className={styles.cp_input}
                              onChange={(e) => setphone(e.target.value)}
                            />
                          </div>
                          <div className={styles.input_container}>
                            <span className={styles.cp_span}>Email :</span>
                            <input
                              className={styles.cp_input}
                              placeholder={customerinfo.email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className={styles.input_container}>
                            <span className={styles.cp_span}>Address:</span>
                            <input
                              placeholder={customerinfo.address}
                              className={styles.cp_input}
                              onChange={(e) => setaddress(e.target.value)}
                            />
                          </div>
                          <button type='submit' onClick={() => updateCusdata(selectedBooking._id)}>Submit</button>
                        </form>
                      </div>
                    </div>
                  )}

                  {isdataview && selectedBooking && (
                    <div className={styles.dataForm}>
                      <div className={styles.closeBtn}>
                        <FontAwesomeIcon className={styles.close} onClick={handleDataVisibility} icon={faXmark} size='xl' />
                      </div>
                      <div className={styles.data_view}>
                        <span className={styles.data_view_span}>See Full details about your booking</span>
                        <div className={styles.data_master}>
                          <h1 className={styles.data_master_h1}>Property Details</h1>
                          <div className={styles.data_container}>
                            <span className={styles.data_container_span1}>Property Name :</span>
                            <span className={styles.data_container_span2}>{selectedBooking.propertyname}</span>
                          </div>
                          {/* Other details... */}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.tablecontainer}>
                    <table className={styles.table_cp}>
                      <tr className={styles.table_cp_tr1}>
                        <th className={styles.table_cp_th}>Name</th>
                        <th className={styles.table_cp_th}>Type</th>
                        <th className={styles.table_cp_th}>Booked Date</th>
                        <th className={styles.table_cp_th}>End Date</th>
                        <th className={styles.table_cp_th3}>Action</th>
                      </tr>
                      {allbookings.map((booking) => (
                        <tr key={booking.id} className={styles.table_cp_tr2}>
                          <td className={styles.table_cp_td}>{booking.propertyname}</td>
                          <td className={styles.table_cp_td}>{booking.type}</td>
                          <td className={styles.table_cp_td}>{booking.bookingDate}</td>
                          <td className={styles.table_cp_td}>{booking.endDate}</td>
                          <td className={styles.table_cp_td}>
                            <div className={styles.table_btn_conatiner}>
                              <button className={styles.eshan_btn} onClick={() => handleNameFormVisibility(booking)}>Edit</button>
                              <button className={styles.eshan_btn3} onClick={() => handleDalertVisibility(booking._id)}>Delete</button>
                              <button className={styles.eshan_btn2} onClick={() => handleDataVisibility(booking)}>View</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
}

export default Customer_Property;
