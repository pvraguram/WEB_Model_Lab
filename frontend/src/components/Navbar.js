import React from 'react';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h1>Hotel Management System</h1>
      <div className="navbar-right">
        <span>Welcome, {user.name}</span>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
