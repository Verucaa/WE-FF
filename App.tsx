import React, { useState } from 'react';
import Login from './components/Login';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'user' | 'admin'>('login');

  const handleUserLogin = () => {
    setView('user');
  };

  const handleAdminLogin = () => {
    setView('admin');
  };

  const handleLogout = () => {
    setView('login');
  };

  return (
    <>
      {view === 'login' && (
        <Login 
          onUserLogin={handleUserLogin} 
          onAdminLogin={handleAdminLogin} 
        />
      )}
      {view === 'user' && (
        <UserPanel onLogout={handleLogout} />
      )}
      {view === 'admin' && (
        <AdminPanel onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
