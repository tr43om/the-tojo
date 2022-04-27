import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

//styles & images
import "./Navbar.scss";
import Temple from "../assets/temple.svg";
import { useLogout } from "../hooks/useLogout";

export const Navbar = () => {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();

  return (
    <div className="navbar">
      <ul>
        <li className="logo">
          <img src={Temple} alt="tojo logo" />
          <span>The Tojo</span>
        </li>

        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}

        {user && (
          <li>
            {!isPending && (
              <button className="btn" onClick={logout}>
                Logout
              </button>
            )}
            {isPending && (
              <button className="btn" onClick={logout} disabled>
                Logging out...
              </button>
            )}
          </li>
        )}
      </ul>
    </div>
  );
};
