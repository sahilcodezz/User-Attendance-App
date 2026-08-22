import React from "react";
import {Link} from "react-router-dom"

const Navbar = () =>{
return(
    <nav>
        <Link to ="/">Home</Link>
         <Link to ="/users">users</Link>
          <Link to ="/newuser">newuser</Link>
           <Link to ="/login">login</Link>
    </nav>
)
}
export default Navbar