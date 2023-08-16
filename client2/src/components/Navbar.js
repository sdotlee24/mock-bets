import React from 'react'
import Auth from './Auth.js'
import {Link} from 'react-router-dom'
import { useCookies } from 'react-cookie'
// import logo from '../images/Drawing-2.png'
export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);


    return (<div className='navbar navbar-expand navbar-dark bg-dark'>
        {/* <img src={logo}></img> */}
        
        <h1 className='navbar-brand home'>MockBets.com </h1>
        <div className='collapse navbar-collapse'>
        <ul className="navbar-nav mr-auto">
            <li className='nav-item'>
                <Link to="/" className="nav-link active">Home</Link> 
            </li>
            <li className='nav-item'>
                <Link to="/about" className='nav-link'>About</Link>
            </li>
            <li className='nav-item'>
                {cookies.access_token && <Link to="/history" className='nav-link'>Bet History</Link>}
            </li>
            
        </ul>
    
        <Auth className="auth2"/>
        
        </div>
    </div>)
}