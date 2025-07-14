import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("");

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/payments/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setPayments(res.data));
  }, []);

  const filtered = payments.filter(p =>
    p.user?.name?.toLowerCase().includes(filter.toLowerCase()) ||
    p.purpose?.toLowerCase().includes(filter.toLowerCase()) ||
    p.reference?.includes(filter)
  );

  return (
    <Layout>
      <div className="container">
        <h2>📂 All Payments (Admin)</h2>
        <input
          placeholder="Search by name, purpose, ref..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: 10, marginBottom: 20, width: "100%" }}
        />
        <ul>
          {filtered.map((p) => (
            <li key={p._id} className="card">
              <p><strong>{p.user?.name}</strong> ({p.user?.email})</p>
              <p><strong>💵 Amount:</strong> {p.amount} {p.currency}</p>
              <p><strong>🔖 Ref:</strong> {p.reference}</p>
              <p><strong>📄 Purpose:</strong> {p.purpose}</p>
              <p><strong>📆 Paid:</strong> {new Date(p.paidAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default AdminPayments;
