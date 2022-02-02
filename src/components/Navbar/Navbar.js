import React from 'react';
import { useLocation } from 'react-router-dom';
const hidingURLs= ['home', 'signup', 'signin', 'addbook']
const Navbar = () => {
    return (
        <div className='navbar'>
            <h1 className='logo'>Logo</h1>
            <input type="text" placeholder='Search books'/>
            <div className='login-btn-parent'>
                <span>Sign In</span>
                <button>Sign Up</button>
            </div>
            
        </div>
    );
};

export default Navbar;