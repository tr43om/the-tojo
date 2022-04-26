import { Link } from "react-router-dom";

//styles & images
import "./Navbar.scss";
import Temple from "../assets/temple.svg";

export const Navbar = () => {
  return (
    <div className="navbar">
      <ul>
        <li className="logo">
          <img src={Temple} alt="tojo logo" />
          <span>The Tojo</span>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <button className="btn">Logout</button>
        </li>
      </ul>
    </div>
  );
};
