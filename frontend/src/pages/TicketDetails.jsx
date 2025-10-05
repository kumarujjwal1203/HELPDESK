import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getTicketById,
  addComment,
  patchTicket,
} from "../services/ticketService";
import { getAllUsers } from "../services/userService";

const TicketDetails = () => {
  const { token, user } = useContext(AuthContext);
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [updates, setUpdates] = useState({
    status: "",
    priority: "",
    assignedTo: "",
  });
  const [users, setUsers] = useState([]);

  const fetchTicket = async () => {
    try {
      const data = await getTicketById(token, id);
      setTicket(data);
      setUpdates({
        status: data.status || "",
        priority: data.priority || "",
        assignedTo: data.assignedTo?._id || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch ticket");
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchTicket();
    if (user.role !== "user") fetchUsers();
  }, [id]);

  const handleComment = async () => {
    if (!comment) return;
    setError("");
    try {
      await addComment(token, id, { body: comment });
      setComment("");
      fetchTicket();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    }
  };

  const handleUpdate = async () => {
    setError("");
    try {
      const data = {};

      if (updates.status && updates.status !== ticket.status) {
        data.status = updates.status;
      }
      if (updates.priority && updates.priority !== ticket.priority) {
        data.priority = updates.priority;
      }
      if (
        user.role !== "user" &&
        updates.assignedTo &&
        updates.assignedTo !== (ticket.assignedTo?._id || "")
      ) {
        data.assignedTo = updates.assignedTo;
      }

      if (Object.keys(data).length === 0) return;

      await patchTicket(token, id, data);
      fetchTicket();
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Ticket has been updated by someone else. Please refresh.");
      } else {
        setError(err.response?.data?.message || "Failed to update ticket");
      }
    }
  };

  if (!ticket) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>{ticket.title}</h2>
      <p>{ticket.description}</p>
      <p>Breached: {ticket.breached ? "Yes" : "No"}</p>

      <div>
        <label>Status:</label>
        <select
          value={updates.status}
          onChange={(e) => setUpdates({ ...updates, status: e.target.value })}
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <label>Priority:</label>
        <select
          value={updates.priority}
          onChange={(e) => setUpdates({ ...updates, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {user.role !== "user" && (
        <div>
          <label>Assign To:</label>
          <select
            value={updates.assignedTo}
            onChange={(e) =>
              setUpdates({ ...updates, assignedTo: e.target.value })
            }
          >
            <option value="">-- Select User --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleUpdate}>Update Ticket</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Timeline</h3>
      {ticket.timeline.map((t, i) => (
        <div key={i} style={{ borderTop: "1px solid gray", marginTop: "5px" }}>
          <p>
            {t.actor} — {t.action} — {t.meta?.message || JSON.stringify(t.meta)}
          </p>
          <p>{new Date(t.createdAt).toLocaleString()}</p>
        </div>
      ))}

      <h3>Add Comment</h3>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={handleComment}>Add Comment</button>
    </div>
  );
};

export default TicketDetails;
