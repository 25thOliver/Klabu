import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import jsPDF from "jspdf";


const UserReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API}/payments/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setReceipts(res.data))
    .catch(() => console.error("Failed to load receipts"));
  }, []);

  const generatePDF = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Receipt`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Reference: ${payment.reference}`, 20, 30);
    doc.text(`Amount: ${payment.amount} ${payment.currency}`, 20, 40);
    doc.text(`Purpose: ${payment.purpose}`, 20, 50);
    doc.text(`Status: ${payment.status}`, 20, 60);
    doc.text(`Date: ${new Date(payment.paidAt).toLocaleString()}`, 20, 70);
    doc.save(`receipt-${payment.reference}.pdf`);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">🧾 Payment Receipts</h2>
        {receipts.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          <ul>
            {receipts.map(r => (
              <li key={r._id} className="card mb-4">
                <p><strong>Reference:</strong> {r.reference}</p>
                <p><strong>Purpose:</strong> {r.purpose}</p>
                <p><strong>Amount:</strong> {r.amount} {r.currency}</p>
                <p><strong>Status:</strong> ✅ {r.status}</p>
                <p><small>{new Date(r.paidAt).toLocaleString()}</small></p>
                <button onClick={() => generatePDF(r)}>Download PDF</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default UserReceipts;
