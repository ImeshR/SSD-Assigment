import React, { useEffect, useState, useContext } from "react";
import styles from "./customer_Info.module.css";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import Navigator from "../../../components/Customer_Profile/profile_nav/Profile_nav";
import Info_Card from "../../../components/Customer_Profile/info_card/Info_card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../../../hooks/UserContext"; // Import the UserContext

const Customer_Info = () => {
  // Use UserContext to get the userid
  const { userId } = useContext(UserContext);

  const [isNameFormVisible, setNameFormVisible] = useState(false);
  const [isEmailFormVisible, setEmailFormVisible] = useState(false);
  const [isPhoneNumberFormVisible, setPhoneNumberFormVisible] = useState(false);
  const [isAddressFormVisible, setAddressFormVisible] = useState(false);
  const [isCurrentCityFormVisible, setCurrentCityFormVisible] = useState(false);
  const [isPhotoVisible, setPhotoFormVisible] = useState(false);
  const [customerinfo, setCustomerinfo] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const createcustomer = () => {
    axios
      .post("http://localhost:7070/api/customer/", { userid: userId })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(userId);
    const getcustomerinfo = () => {
      axios(`http://localhost:7070/api/customer/customer_info/${userId}`)
        .then((res) => {
          if (res.data.length === 0) {
            createcustomer();
          }
          setCustomerinfo(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getcustomerinfo();
  }, [userId]);

  const handleFirstNameChange = (event) => {
    setCustomerinfo({
      ...customerinfo,
      fname: event.target.value,
    });
  };

  const handleLastNameChange = (event) => {
    setCustomerinfo({
      ...customerinfo,
      lname: event.target.value,
    });
  };

  const handleEmailChange = (event) => {
    setCustomerinfo({
      ...customerinfo,
      email: event.target.value,
    });
  };

  const handlePhoneNumberChange = (event) => {
    setCustomerinfo({
      ...customerinfo,
      phone: event.target.value,
    });
  };

  const handleAddressChange = (event) => {
    setCustomerinfo({
      ...customerinfo,
      address: event.target.value,
    });
  };

  const handleCurrentCityChange = (event) => {
    setCustomerinfo({
      ...customerinfo,
      city: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .put(`http://localhost:7070/api/customer/updatename/${userId}`, {
        fname: customerinfo.fname,
        lname: customerinfo.lname,
      })
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Check your inserted Details", "error");
      });

    setNameFormVisible(false);
  };

  const handleSubmit2 = (event) => {
    event.preventDefault();

    axios
      .put(`http://localhost:7070/api/customer/updateemail/${userId}`, {
        email: customerinfo.email,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Check your inserted Details", "error");
      });

    setEmailFormVisible(false);
  };

  const handleSubmit3 = (event) => {
    event.preventDefault();

    axios
      .put(`http://localhost:7070/api/customer/updatephone/${userId}`, {
        phone: customerinfo.phone,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Check your inserted Details", "error");
      });

    setPhoneNumberFormVisible(false);
  };

  const handleSubmit4 = (event) => {
    event.preventDefault();

    axios
      .put(`http://localhost:7070/api/customer/updateaddress/${userId}`, {
        address: customerinfo.address,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Check your inserted Details", "error");
      });

    setAddressFormVisible(false);
  };

  const handleSubmit5 = (event) => {
    event.preventDefault();

    axios
      .put(`http://localhost:7070/api/customer/updatecity/${userId}`, {
        city: customerinfo.city,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Check your inserted Details", "error");
      });

    setCurrentCityFormVisible(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit6 = () => {
    const data = new FormData();
    data.append("file", selectedFile);

    axios
      .put(`http://localhost:7070/api/customer/updateavatar/${userId}`, data)
      .then((res) => {
        console.log(res.statusText);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validateEmail = () => {
    const emailInput = document.getElementById("email-input");
    const regex = /\S+@\S+\.\S+/;
    if (regex.test(emailInput.value)) {
      emailInput.style.borderColor = "green";
      emailInput.style.boxShadow = "0 0 10px #4cdd69";
    } else {
      emailInput.style.borderColor = "red";
      emailInput.style.boxShadow = "0 0 10px #ef5d4f";
    }
  };

  const restrictInput = (event) => {
    const input = event.target;
    const value = input.value;
    const sanitizedValue = value.replace(/\D/g, ""); // Remove non-numeric characters

    if (sanitizedValue.charAt(0) !== "0") {
      input.value = "0" + sanitizedValue; // Ensure first character is '0'
    } else {
      input.value = sanitizedValue;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="master">
        <Navigator />
        <div className="profile_home">
          <Info_Card />
          <div className={styles.main_card}>
            {/* Personal info and forms go here */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Customer_Info;
