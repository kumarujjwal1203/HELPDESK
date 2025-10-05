import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, token, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        borderBottom: "1px solid gray",
      }}
    >
      <div>
        {token && (
          <>
            <Link to="/tickets">Tickets</Link> |{" "}
            <Link to="/tickets/new">New Ticket</Link>
            {user?.role === "admin" && (
              <>
                {" "}
                | <Link to="/admin/users">Users</Link>
              </>
            )}
          </>
        )}
      </div>
      <div>
        {token ? (
          <>
            <span>
              {user?.name} ({user?.role})
            </span>{" "}
            | <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
