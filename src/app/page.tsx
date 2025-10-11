'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TableSelection from './components/TableSelection';
import POSInterface from './components/POSInterface';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [showMenu, setShowMenu] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    // Check localStorage or session for login status
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (!loginStatus) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setSelectedTable('');
    setShowMenu(false);
    router.push('/login');
  };

  const handleTableSelect = (tableNumber: string) => {
    console.log('handleTableSelect called with:', tableNumber);
    setSelectedTable(tableNumber);
    setShowMenu(true);
  };

  const handleBackToTableSelection = () => {
    setShowMenu(false);
    setSelectedTable('');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  // Show loading while checking login status
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  // หน้าเลือกโต๊ะ
  if (!showMenu) {
    return (
      <div className="min-h-screen bg-gray-800">
        <TableSelection 
          onTableSelect={handleTableSelect} 
          onBackToDashboard={handleBackToDashboard}
        />
      </div>
    );
  }

  // หน้า POS Interface
  return (
    <div className="min-h-screen bg-gray-800">
      <POSInterface 
        selectedTable={selectedTable} 
        onBackToTableSelection={handleBackToTableSelection}
        onLogout={handleLogout}
      />
    </div>
  );
}
