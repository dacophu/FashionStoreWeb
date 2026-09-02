import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/logo.png'
import profileicon from '../../assets/profile.png'
export default function Navbar() {
  return (
    <div className='navbar'>
        <img src={navlogo} alt="" className="nav-logo" />
    </div>
  )
}
