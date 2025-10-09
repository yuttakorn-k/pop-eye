'use client';

import { useState } from 'react';
import TableSelection from './components/TableSelection';
import POSInterface from './components/POSInterface';

export default function Home() {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [showMenu, setShowMenu] = useState(false);

  const handleTableSelect = (tableNumber: string) => {
    setSelectedTable(tableNumber);
    setShowMenu(true);
  };

  const handleBackToTableSelection = () => {
    setShowMenu(false);
    setSelectedTable('');
  };

  if (showMenu && selectedTable) {
    return (
      <div className="min-h-screen bg-gray-800">
        <POSInterface 
          selectedTable={selectedTable} 
          onBackToTableSelection={handleBackToTableSelection}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <TableSelection onTableSelect={handleTableSelect} />
    </div>
  );
}
