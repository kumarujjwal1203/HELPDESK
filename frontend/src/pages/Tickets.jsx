import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getTickets } from "../services/ticketService";
import TicketCard from "../components/TicketCard";

const Tickets = () => {
  const { token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [breachedFilter, setBreachedFilter] = useState("");

  const fetchTickets = async () => {
    const params = {
      limit,
      offset,
      search: search || undefined,
      status: statusFilter || undefined,
      assignedTo: assignedToFilter || undefined,
      breached: breachedFilter || undefined,
    };
    const data = await getTickets(token, params);
    setTickets(data.tickets);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchTickets();
  }, [limit, offset, search, statusFilter, assignedToFilter, breachedFilter]);

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto" }}>
      <h2>Tickets</h2>
      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <input
          placeholder="Assigned To"
          value={assignedToFilter}
          onChange={(e) => setAssignedToFilter(e.target.value)}
        />
        <select
          value={breachedFilter}
          onChange={(e) => setBreachedFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Breached</option>
          <option value="false">Not Breached</option>
        </select>
      </div>
      {tickets.map((t) => (
        <TicketCard key={t._id} ticket={t} />
      ))}
      <div>
        <button
          disabled={offset === 0}
          onClick={() => setOffset(Math.max(offset - limit, 0))}
        >
          Prev
        </button>
        <span>
          {offset + 1} - {Math.min(offset + limit, total)} of {total}
        </span>
        <button
          disabled={offset + limit >= total}
          onClick={() => setOffset(offset + limit)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Tickets;
