import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createTicket } from "../services/ticketService";
import { useNavigate } from "react-router-dom";

const NewTicket = () => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    slaHours: 1,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createTicket(token, form);
      navigate("/tickets");
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.msg || "Failed to create ticket"
      );
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>New Ticket</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label>SLA Hours</label>
          <input
            type="number"
            name="slaHours"
            value={form.slaHours}
            onChange={handleChange}
            min="1"
          />
        </div>
        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
};

export default NewTicket;
