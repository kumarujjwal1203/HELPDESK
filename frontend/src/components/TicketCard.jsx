import { Link } from "react-router-dom";

const TicketCard = ({ ticket }) => {
  return (
    <div style={{ border: "1px solid gray", margin: "5px 0", padding: "5px" }}>
      <Link to={`/tickets/${ticket._id}`}>
        <h3>{ticket.title}</h3>
      </Link>
      <p>
        Status: {ticket.status} | Priority: {ticket.priority}
      </p>
      <p>Breached: {ticket.breached ? "Yes" : "No"}</p>
    </div>
  );
};

export default TicketCard;
