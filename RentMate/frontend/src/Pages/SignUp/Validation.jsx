function Validation(values) {
  let errors = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const password_pattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const contact_number = /^\d{10}$/;

  if (!values.fname.trim()) {
    errors.fname = "First name is required!";
  }

  if (!values.lname.trim()) {
    errors.lname = "Last name is required!";
  }

  if (!values.username.trim()) {
    errors.username = "Username is required!";
  }

  if (!values.email) {
    errors.email = "Email is required!";
  } else if (!email_pattern.test(values.email)) {
    errors.email = "Invalid email format!";
  }

  if (!values.contactNumber) {
    errors.contactNumber = "Contact number is required";
  } else if (!contact_number.test(values.contactNumber)) {
    errors.contactNumber = "Contact number should contain exactly 10 digits";
  }

  if (!values.password) {
    errors.password = "Password is required!";
  } else if (!password_pattern.test(values.password)) {
    errors.password =
      "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Please confirm your password!";
  } else if (values.confirm_password !== values.password) {
    errors.confirm_password = "Passwords do not match!";
  }

  if (!values.type) {
    errors.type = "Please select a role!";
  }

  return errors;
}

export default Validation;
