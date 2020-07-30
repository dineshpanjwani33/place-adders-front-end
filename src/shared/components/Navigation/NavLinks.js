import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
    const auth = useContext(AuthContext);

    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/" exact>ALL USERS</NavLink>
            </li>
            {auth.isLogeddin && <li>
                <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
            </li>
            }
            {auth.isLogeddin && <li>
                <NavLink to="/places/new">ADD PLACE</NavLink>
            </li>
            }
            {!auth.isLogeddin && <li>
                <NavLink to="/auth">AUTHENTICATE</NavLink>
            </li>
            }
            {auth.isLogeddin && 
                <button onClick={auth.logout}>LOGOUT</button>
            }
        </ul>
    )
};

export default NavLinks;