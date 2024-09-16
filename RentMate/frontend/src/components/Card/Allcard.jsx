import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify"; // import the DOMPurify library

function Allcard() {
  const [card, setcard] = useState([]);

  function getCard() {
    axios
      .get("http://localhost:8080/card/")
      .then((res) => {
        console.log(res);
        setcard(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  useEffect(() => {
    getCard();
  }, []);

  // Delete data
  function deletedata(i) {
    if (window.confirm('Do you want to delete "' + i.name + '" ?')) {
      axios
        .delete("http://localhost:8070/card/delete/" + i._id)
        .then(() => {
          getCard();
        })
        .catch((err) => {
          alert(err);
        });
    }
  }

  // Function to sanitize the values before rendering
  const sanitize = (value) => {
    return DOMPurify.sanitize(value);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Card Type</th>
          <th>Name</th>
          <th>Card Number</th>
          <th>Expiry Month</th>
          <th>Expiry Year</th>
          <th>cvv</th>
        </tr>
      </thead>
      <tbody>
        {card.map((pay) => (
          <tr key={pay._id}>
            <td>{sanitize(pay.name)}</td>
            <td>{sanitize(pay.packages)}</td>
            <td>{sanitize(pay.price)}</td>
            <td>{sanitize(pay.cardnumber)}</td>
            <td>{sanitize(pay.MM)}</td>
            <td>{sanitize(pay.YY)}</td>
            <td>{sanitize(pay.cvv)}</td>
            <td>
              <Link to={`/EditPayment/${pay._id}`}>
                <button type="submit">Edit</button>
              </Link>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => deletedata(pay)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Allcard;
