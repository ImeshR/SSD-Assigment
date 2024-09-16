import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";
import Login from "./images/RentMate.png";
import profile from "../../Images/profile.png";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const [imageError, setImageError] = useState(false);

  console.log(user); // Keep this for debugging

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <nav className='bg-gradient-to-r from-slate-600 to-slate-900 text-white p-4 flex justify-between items-center shadow-lg'>
      <div className='flex items-center space-x-4'>
        <Link to='/' className='flex items-center space-x-2'>
          <img
            src={Login}
            alt='site-logo'
            className='w-12 h-12 object-cover rounded-full shadow-md'
          />
          <span className='text-3xl font-bold'>RentMate</span>
        </Link>
      </div>
      <div className='flex items-center space-x-4'>
        {user ? (
          <>
            <button
              onClick={handleLogout}
              className='bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg'
            >
              Logout
            </button>
            <img
              src={
                !imageError && user.profileImage ? user.profileImage : profile
              }
              alt='User Avatar'
              className='w-10 h-10 rounded-full object-cover border-2 border-white shadow-md'
              onError={handleImageError}
            />
          </>
        ) : (
          <>
            <Link
              to='/signup'
              className='bg-white hover:to-orange-600 text-slate-600 py-2 px-4 rounded-full font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg'
            >
              Signup
            </Link>
            <Link
              to='/login'
              className='bg-white hover:from-green-500 hover:to-blue-600 text-slate-600 py-2 px-4 rounded-full font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg'
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
