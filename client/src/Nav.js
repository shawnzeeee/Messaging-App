import React from 'react';
import './App.css';
import {Link} from 'react-router-dom';
function Nav(){
    return(
        <nav>
            <ul className = "nav-links">
                <Link to="/signin">
                    <li>Sign In</li>
                </Link>
                <Link to="/createaccount">
                    <li>Create Account</li>
                </Link>
               
            </ul> 
        </nav>

    );
    
}

export default Nav;