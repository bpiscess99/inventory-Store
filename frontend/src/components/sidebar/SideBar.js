import React, { useState } from 'react';
import { RiProductHuntLine } from 'react-icons/ri';
import { HiMenuAlt3 } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import menu from '../../data/sidebar';
import SidebarItem from './SidebarItem';
import "./SideBar.scss"

const SideBar = ({children}) => {

const [isOpen, setIsOpen] = useState(true);    
const navigate = useNavigate()
const toggle = () => setIsOpen(!isOpen)
const goHome = () => {
    navigate("/")
}
  return (
    <div className='layout'>
      <div className="sidebar" style={{ width: isOpen ? "230px" : "60px" }}>
        <div className='top_section'>
            <div className="logo" style={{ display: isOpen ? "block" : "none" }}>
             <RiProductHuntLine size={35} style={{cursor: "pointer"}}
             onClick={goHome}
             />
            </div>

            <div className='bars'
            style={{ marginLeft: isOpen ? "100px" : "0px" }}>
            <HiMenuAlt3 onClick={toggle}/>
            </div>
        </div>
        
    {
        menu.map((item, index) => {
            return <SidebarItem key={index} item={item} isOpen={isOpen}/>
        })
    }
    
    </div>

    <main
     style={{
        paddingLeft: isOpen ? "230px" : "60px",
        transition: "all .5s",
      }}>
        {children}
    </main>

    </div>

    
  )
}

export default SideBar
