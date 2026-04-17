import React, { useState } from 'react';

const LoginScreen = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [broker, setBroker] = useState('DHAN');

  const handleSendOtp = () => {
    if(phone.length < 10) {
      alert("Please enter a valid 10-digit number");
      return;
    }
    setStep(2); // Move to OTP step
  };

  const handleVerify = () => {
    // Session data with Broker Info
    const userData = { 
      phone, 
      broker, 
      status: "active",
      loginTime: new Date().toISOString() 
    };
    onLogin(userData);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.logo}>TRINETR PRO</h1>
      
      <div style={styles.card}>
        {step === 1 ? (
          <>
            <label style={styles.label}>Select Your Broker</label>
            <select 
              style={styles.input} 
              value={broker} 
              onChange={(e) => setBroker(e.target.value)}
            >
              <option value="DHAN">Dhan</option>
              <option value="SHOONYA">Shoonya</option>
              <option value="ANGELONE">Angel One</option>
              <option value="UPSTOX">Upstox</option>
            </select>

            <input 
              type="tel"
              placeholder="Enter Mobile Number" 
              style={styles.input}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={handleSendOtp} style={styles.button}>NEXT</button>
          </>
        ) : (
          <>
            <p style={{color: '#aaa'}}>OTP sent to {phone}</p>
            <input 
              type="number"
              placeholder="Enter 6-Digit OTP" 
              style={styles.input}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerify} style={styles.button}>VERIFY & CONNECT</button>
            <button onClick={() => setStep(1)} style={styles.backBtn}>BACK</button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' },
  logo: { fontSize: '28px', color: '#f39c12', marginBottom: '20px', fontWeight: 'bold' },
  card: { background: '#151515', padding: '30px', borderRadius: '12px', width: '85%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888' },
  input: { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #333', background: '#000', color: '#fff', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', background: '#f39c12', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  backBtn: { width: '100%', marginTop: '10px', background: 'transparent', color: '#888', border: 'none', cursor: 'pointer' }
};

export default LoginScreen;
                
