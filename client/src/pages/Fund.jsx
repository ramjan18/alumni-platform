import React, { useState } from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const [method, setMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState('607d1b2f5c0f1a23456789ab'); // Sample user ID

  const validateCard = () => {
    return (
      /^\d{16}$/.test(cardNumber) &&
      /^[A-Za-z\s]+$/.test(name) &&
      /^\d{2}\/\d{2}$/.test(expiry) &&
      /^\d{3}$/.test(cvv) &&
      parseFloat(amount) > 0
    );
  };

  const handlePayment = async () => {
    if (method === 'card' && !validateCard()) {
      return alert('Invalid card details');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/payments/pay', {
        userId,
        amount: parseFloat(amount)
      });

      alert('Payment Successful!');
      console.log(res.data);
    } catch (err) {
      alert('Payment Failed!');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto shadow-xl rounded-2xl bg-white">
      <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setMethod('card')} className={`px-4 py-2 rounded ${method === 'card' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Credit Card</button>
        <button onClick={() => setMethod('qr')} className={`px-4 py-2 rounded ${method === 'qr' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>QR Code</button>
      </div>

      <input type="number" placeholder="Amount" className="w-full mb-4 p-2 border rounded" value={amount} onChange={(e) => setAmount(e.target.value)} />

      {method === 'card' && (
        <>
          <input type="text" placeholder="Card Number" maxLength={16} className="w-full mb-2 p-2 border rounded" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
          <input type="text" placeholder="Name" className="w-full mb-2 p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex space-x-2 mb-2">
            <input type="text" placeholder="MM/YY" className="w-1/2 p-2 border rounded" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
            <input type="text" placeholder="CVV" className="w-1/2 p-2 border rounded" value={cvv} onChange={(e) => setCvv(e.target.value)} />
          </div>
        </>
      )}

      {method === 'qr' && (
        <div className="flex justify-center mb-4">
          <img src="https://api.qrserver.com/v1/create-qr-code/?data=pay123&size=150x150" alt="QR" />
        </div>
      )}

      <button onClick={handlePayment} className="w-full bg-black text-white py-2 rounded-lg">Pay</button>
    </div>
  );
};

export default PaymentPage;
