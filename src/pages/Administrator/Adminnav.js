import React from "react";
import people from "../../assets/people.png"
import logo from "../../assets/logo.png"
import {Link} from "react-router-dom"
// import Applications from "./pages/TA_applicant/taapplication";




 const AdminNavbar=()=>{
    return(
        <nav className="navba">
                <div className="navbar-container">
                    <div className="logo">
                    <Link to="/">
                      <img src={logo} alt="Logo" />
                    </Link>
                    </div>
                    
                      <ul className="nav-links">
                          <li><Link to="/admindash">Home</Link></li>
                          <li><Link to="/addCourses">Add Courses</Link></li>
                          <li><Link to="/recom">TA recommendations</Link></li>
                          <li>
                          <Link to="/profile">
                            <img src={people} alt="Logo" className="profile-image" />
                          </Link>
                             </li>
          
                          
                      </ul>
                    
                </div>
            </nav>


        

    );
 };
 export default AdminNavbar