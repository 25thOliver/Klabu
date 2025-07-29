import React, { useState, useRef } from 'react';

// Mock user (in a real app, get this from auth context)
const mockUser = {
  id: 2,
  name: 'John Doe',
};

// Mock payment data
const initialPayments = [
  { id: 1, description: 'Membership Fee 2024', amount: 50, status: 'paid', date: '2024-01-10' },
  { id: 2, description: 'Football Tournament', amount: 20, status: 'pending', date: '2024-06-01' },
  { id: 3, description: 'Tennis Court Booking', amount: 10, status: 'paid', date: '2024-05-15' },
  { id: 4, description: 'Basketball Clinic', amount: 15, status: 'failed', date: '2024-04-20' },
];

const PaymentsPage = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ description: '', amount: '' });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState(null);
  const receiptRef = useRef();

  // Calculate totals
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  // Handle new payment (mock)
  const handleNewPayment = (e) => {
    e.preventDefault();
    setPayments([
      ...payments,
      {
        id: payments.length + 1,
        description: newPayment.description,
        amount: parseFloat(newPayment.amount),
        status: 'pending',
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setShowPaymentForm(false);
    setNewPayment({ description: '', amount: '' });
  };

  // Handle view receipt
  const handleViewReceipt = (payment) => {
    setReceiptPayment(payment);
    setShowReceipt(true);
  };

  // Print only the receipt content
  const handlePrintReceipt = () => {
    const printContents = receiptRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // To restore event listeners and state
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <div className="mb-6 flex gap-8">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
          <div className="text-sm">Total Paid</div>
          <div className="text-lg font-bold">KES {totalPaid.toFixed(2)}</div>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded">
          <div className="text-sm">Outstanding</div>
          <div className="text-lg font-bold">KES {totalOutstanding.toFixed(2)}</div>
        </div>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowPaymentForm(true)}
      >
        Make a Payment
      </button>
      <h2 className="text-xl font-semibold mb-2">Payment History</h2>
      <ul>
        {payments.length === 0 && <li className="text-gray-500">No payments yet.</li>}
        {payments.map(payment => (
          <li key={payment.id} className="mb-3 p-4 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{payment.description}</div>
              <div className="text-sm text-gray-600">{payment.date}</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">KES {payment.amount.toFixed(2)}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                payment.status === 'paid'
                  ? 'bg-green-200 text-green-800'
                  : payment.status === 'pending'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-red-200 text-red-800'
              }`}>
                {payment.status}
              </span>
              <button
                className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                onClick={() => handleViewReceipt(payment)}
              >
                View Receipt
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow max-w-md w-full" onSubmit={handleNewPayment}>
            <h2 className="text-lg font-bold mb-4">New Payment</h2>
            <input
              className="border p-2 mb-2 w-full rounded"
              type="text"
              placeholder="Description"
              value={newPayment.description}
              onChange={e => setNewPayment({ ...newPayment, description: e.target.value })}
              required
            />
            <input
              className="border p-2 mb-4 w-full rounded"
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={newPayment.amount}
              onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded mr-2"
                onClick={() => setShowPaymentForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit Payment
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Receipt Modal */}
      {showReceipt && receiptPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <div ref={receiptRef} id="printable-receipt">
              <h2 className="text-lg font-bold mb-4">Payment Receipt</h2>
              <div className="mb-2"><span className="font-semibold">Receipt No:</span> #{receiptPayment.id}</div>
              <div className="mb-2"><span className="font-semibold">Name:</span> {mockUser.name}</div>
              <div className="mb-2"><span className="font-semibold">Description:</span> {receiptPayment.description}</div>
              <div className="mb-2"><span className="font-semibold">Amount:</span> KES {receiptPayment.amount.toFixed(2)}</div>
              <div className="mb-2"><span className="font-semibold">Date:</span> {receiptPayment.date}</div>
              <div className="mb-4"><span className="font-semibold">Status:</span> {receiptPayment.status}</div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handlePrintReceipt}
              >
                Print Receipt
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowReceipt(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt { position: absolute; left: 0; top: 0; width: 100vw; background: white; z-index: 9999; }
        }
      `}</style>
    </div>
  );
};

export default PaymentsPage;
