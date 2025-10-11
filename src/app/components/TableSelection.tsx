'use client';

import { useMemo, useState } from 'react';

interface Table {
  id: number;
  number: string;
  zone: 'นอก' | 'กลาง' | 'ใน';
  status: 'available' | 'in-use' | 'paid';
  capacity: number;
}

interface TableSelectionProps {
  onTableSelect: (tableNumber: string) => void;
  onBackToDashboard?: () => void;
}

export default function TableSelection({ onTableSelect, onBackToDashboard }: TableSelectionProps) {
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState<'ทั้งหมด' | 'นอก' | 'กลาง' | 'ใน'>('ทั้งหมด');

  // Tables 1-21 = ใน, 22-30 = กลาง, 31-40 = นอก
  const tables: Table[] = useMemo(() => {
    const statusFor = (n: number): Table['status'] => {
      if ([5, 10, 15, 20, 25, 30, 35, 40].includes(n)) return 'paid';
      if ([2, 4, 7, 9, 12, 14, 18, 22, 27, 31, 33, 37].includes(n)) return 'in-use';
      return 'available';
    };
    const zoneFor = (n: number): Table['zone'] => {
      if (n >= 1 && n <= 21) return 'ใน';
      if (n >= 22 && n <= 30) return 'กลาง';
      return 'นอก';
    };
    return Array.from({ length: 40 }, (_, i) => {
      const n = i + 1;
      return {
        id: n,
        number: String(n),
        zone: zoneFor(n),
        status: statusFor(n),
        capacity: 4,
      } as Table;
    });
  }, []);

  const zones: Array<'นอก' | 'กลาง' | 'ใน'> = ['ใน', 'กลาง', 'นอก'];

  const filteredTables = useMemo(() => {
    const q = search.trim().toLowerCase();
    let t = tables;
    if (zoneFilter !== 'ทั้งหมด') {
      t = t.filter(tb => tb.zone === zoneFilter);
    }
    if (!q) return t;
    return t.filter(tb => tb.number.toLowerCase().includes(q));
  }, [search, zoneFilter]);

  const zoneToEmoji = (zone: 'นอก' | 'กลาง' | 'ใน') => {
    switch (zone) {
      case 'นอก':
        return '🌿';
      case 'กลาง':
        return '🏠';
      case 'ใน':
        return '🛋️';
    }
  };

  // no badge used now; keep mapping helpers minimal

  const statusText = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'ว่าง';
      case 'in-use':
        return 'ใช้งาน';
      case 'paid':
        return 'ชำระเงิน';
      default:
        return '—';
    }
  };

  const capacityDots = (count: number) => (
    <div className="flex -space-x-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="inline-block w-3 h-3 rounded-full bg-white ring-2 ring-gray-300" />
      ))}
    </div>
  );

  const handleTableClick = (table: Table) => {
    console.log('Table clicked:', table);
    // เข้าหน้าเมนูทันทีเมื่อกดโต๊ะ ไม่บล็อกตามสถานะ
    onTableSelect(table.number);
  };

  const Stat = ({ label, value }: { label: string; value: number }) => (
    <div className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 text-sm">
      <span className="text-gray-600">{label}:</span> <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );

  const Legend = ({ colorClass, label }: { colorClass: string; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className={`w-3 h-3 rounded-full ${colorClass}`} />
      <span className="text-gray-600">{label}</span>
    </div>
  );

  const totalAvailable = tables.filter(t => t.status === 'available').length;
  const totalAll = tables.length;

  function tableFillByStatus(status: Table['status']) {
    switch (status) {
      case 'available':
        return 'bg-green-500 text-white border-green-600';
      case 'in-use':
        return 'bg-red-500 text-white border-red-600';
      case 'paid':
        return 'bg-amber-500 text-white border-amber-600';
      default:
        return 'bg-green-500 text-white border-green-600';
    }
  }

  const TableGraphic = ({ number, capacity, status }: { number: string; capacity: number; status: Table['status'] }) => {
    const displayNumber = (number.replace(/[^0-9]/g, '') || number).toString();
    
    const tableColorByStatus = (status: Table['status']) => {
      switch (status) {
        case 'available':
          return 'bg-white border border-gray-300';
        case 'in-use':
          return 'bg-red-400 border border-red-500';
        case 'paid':
          return 'bg-amber-400 border border-amber-500';
        default:
          return 'bg-white border border-gray-300';
      }
    };

    const chairColorByStatus = (status: Table['status']) => {
      switch (status) {
        case 'available':
          return 'bg-transparent border border-gray-300';
        case 'in-use':
          return 'bg-red-400 border border-red-500';
        case 'paid':
          return 'bg-amber-400 border border-amber-500';
        default:
          return 'bg-transparent border border-gray-300';
      }
    };

    return (
      <div className="relative w-40 h-40">
        {/* Table - Large rounded square with color based on status */}
        <div className={`absolute inset-2 rounded-3xl ${tableColorByStatus(status)}`}>
          {/* Table number badge - centered with gray background like in the image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{displayNumber}</span>
          </div>
        </div>

        {/* Chairs - 4 rounded rectangles around the table with color based on status */}
        {/* Top chair - horizontal (wider than tall) */}
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-5 w-16 h-5 rounded-3xl ${chairColorByStatus(status)}`}></div>
        
        {/* Bottom chair - horizontal (wider than tall) */}
        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-5 w-16 h-5 rounded-3xl ${chairColorByStatus(status)}`}></div>
        
        {/* Left chair - vertical (taller than wide) */}
        <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 w-5 h-16 rounded-3xl ${chairColorByStatus(status)}`}></div>
        
        {/* Right chair - vertical (taller than wide) */}
        <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 w-5 h-16 rounded-3xl ${chairColorByStatus(status)}`}></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="ย้อนกลับไปหน้าเลือกระบบ"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">PS</div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">เลือกโต๊ะ</h1>
                <p className="text-xs text-gray-600">Popeye POS</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Stat label="โต๊ะว่าง" value={totalAvailable} />
              <Stat label="ทั้งหมด" value={totalAll} />
            </div>
          </div>

          <div className="mt-4">
            {/* Zone Filter Tabs */}
            <div className="bg-gray-100 rounded-xl p-1.5 mb-6 inline-block shadow-sm border border-gray-200">
              <div className="flex gap-1">
                {(['ทั้งหมด', 'นอก', 'กลาง', 'ใน'] as const).map(zone => (
                  <button
                    key={zone}
                    onClick={() => {
                      console.log('Zone clicked:', zone);
                      setZoneFilter(zone);
                    }}
                    className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                      zoneFilter === zone
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* Second Row: Status Legend on left, Search on right */}
            <div className="flex justify-between items-center mb-6">
              {/* Status Legend */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-700">ว่าง</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-700">ใช้งาน</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-gray-700">ชำระเงิน</span>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative w-80">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาโต๊ะ เช่น 12"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              </div>
            </div>

            {/* Tables */}
            {filteredTables.length === 0 ? (
              <div className="h-[40vh] grid place-content-center">
                <p className="text-gray-600">ไม่พบโต๊ะตามที่ค้นหา</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-12">
                {filteredTables.map(table => (
                  <button
                    key={table.id}
                    onClick={() => handleTableClick(table)}
                    className="group relative p-3 rounded-lg hover:bg-gray-100 transition-colors text-left cursor-pointer"
                    title={`โซน${table.zone}`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="p-2 flex items-center gap-3">
                      <TableGraphic number={table.number} capacity={table.capacity} status={table.status} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
          <Legend colorClass="bg-green-500" label="ว่าง" />
          <Legend colorClass="bg-red-500" label="ใช้งาน" />
          <Legend colorClass="bg-amber-500" label="ชำระเงิน" />
        </div>
      </div>
    </div>
  );
}
