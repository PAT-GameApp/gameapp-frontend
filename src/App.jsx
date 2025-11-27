import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    alert(`Username/Email: ${username}\nPassword: ${password}\nRemember me: ${remember}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f5f7fa' }}>
      {/* Left Side Panel */}
      <div style={{ flex: 1, background: 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80) center/cover', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem', minWidth: 350 }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="Logo" style={{ width: '70px', marginBottom: '2rem', background: '#fff', borderRadius: '50%', padding: '0.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>Hello<br /><span style={{ color: '#ffd700' }}>Partner.</span></h1>
        <div style={{ marginTop: '2rem', fontSize: '1.1rem', opacity: 0.9 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <img src="https://img.icons8.com/ios-filled/50/ffffff/map-marker.png" alt="Venues" style={{ width: 28, marginRight: 10 }} /> Venues & Clubs
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <img src="https://img.icons8.com/ios-filled/50/ffffff/sneakers.png" alt="Activity" style={{ width: 28, marginRight: 10 }} /> Activity Organizers
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="https://img.icons8.com/ios-filled/50/ffffff/whistle.png" alt="Trainers" style={{ width: 28, marginRight: 10 }} /> Trainers & Academies
          </div>
        </div>
      </div>
      {/* Right Side Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div className="login-box" style={{ background: '#fff', padding: '2.5rem 2.5rem', borderRadius: '16px', boxShadow: '0 2px 24px rgba(0,0,0,0.10)', width: '370px', minHeight: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, fontWeight: 600, color: '#0a2a43', fontSize: '2rem' }}>Login</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Username or Email</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Enter your username or email"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #bfc9d1', fontSize: '1rem' }}
              />
            </div>
            <div style={{ marginBottom: '1.2rem' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #bfc9d1', fontSize: '1rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.7rem' }}>
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="remember" style={{ fontSize: '0.98rem' }}>Remember me</label>
            </div>
            <button type="submit" style={{ width: '100%', padding: '0.85rem', background: '#005fa3', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.08rem', cursor: 'pointer', letterSpacing: 1 }}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App
