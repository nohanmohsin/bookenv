import React from 'react';

const Navbar = () => {
    return (
        <div className='navbar'>
            <h1 className='logo'>Logo</h1>
            <input type="text" placeholder='Search books'/>
            <span>Sign In</span>
            <button>Sign Up</button>
        </div>
    );
};

export default Navbar;