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
}

export default function TableSelection({ onTableSelect }: TableSelectionProps) {
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

  const zones: Array<'นอก' | 'กลาง' | 'ใน'> = ['นอก', 'กลาง', 'ใน'];

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
        <span key={i} className="inline-block w-3 h-3 rounded-full bg-white/80 ring-2 ring-gray-900" />
      ))}
    </div>
  );

  const handleTableClick = (table: Table) => {
    // เข้าหน้าเมนูทันทีเมื่อกดโต๊ะ ไม่บล็อกตามสถานะ
    onTableSelect(table.number);
  };

  const Stat = ({ label, value }: { label: string; value: number }) => (
    <div className="px-3 py-2 rounded-lg bg-gray-800/80 border border-gray-700 text-gray-300 text-sm">
      <span className="text-gray-400">{label}:</span> <span className="font-semibold text-white">{value}</span>
    </div>
  );

  const Legend = ({ colorClass, label }: { colorClass: string; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className={`w-3 h-3 rounded-full ${colorClass}`} />
      <span className="text-gray-400">{label}</span>
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
    const chairsToRender = Math.min(Math.max(capacity, 2), 8);
    const size = 128; // w-32 / h-32
    const center = size / 2; // 64
    const radius = 52; // radius for chairs circle
    const displayNumber = (number.replace(/[^0-9]/g, '') || number).toString();

    return (
      <div className="relative w-32 h-32">
        {Array.from({ length: chairsToRender }).map((_, i) => {
          const angle = (2 * Math.PI * i) / chairsToRender - Math.PI / 2; // start at top
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <span
              key={i}
              style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
              className="absolute w-4 h-4 rounded-full bg-gray-300 border border-gray-600 shadow-sm"
            />
          );
        })}
        <div className={`absolute inset-6 rounded-full border grid place-content-center text-2xl font-extrabold ${tableFillByStatus(status)}`}>
          {displayNumber}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-gray-900/70 bg-gray-900/90 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">PS</div>
              <div>
                <h1 className="text-lg font-semibold text-white">เลือกโต๊ะ</h1>
                <p className="text-xs text-gray-400">Popeye POS</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Stat label="โต๊ะว่าง" value={totalAvailable} />
              <Stat label="ทั้งหมด" value={totalAll} />
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-3">
            {/* Zone filter */}
            <div className="inline-flex items-center bg-gray-800/80 border border-gray-700 rounded-lg p-1">
              {(['ทั้งหมด', 'นอก', 'กลาง', 'ใน'] as const).map(z => (
                <button
                  key={z}
                  onClick={() => setZoneFilter(z)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    zoneFilter === z ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative md:ml-auto w-full md:w-80">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาโต๊ะ เช่น 12"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Legend */}
        <div className="mb-5 flex flex-wrap items-center gap-4 justify-center md:justify-start">
          <Legend colorClass="bg-green-500" label="ว่าง" />
          <Legend colorClass="bg-red-500" label="ใช้งาน" />
          <Legend colorClass="bg-amber-500" label="ชำระเงิน" />
        </div>

        {/* Unified table list with optional zone filter */}
        {filteredTables.length === 0 ? (
          <div className="h-[60vh] grid place-content-center">
            <p className="text-gray-400">ไม่พบโต๊ะตามที่ค้นหา</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {filteredTables.map(table => (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                className="group relative p-1 rounded-lg hover:bg-gray-800/30 transition-colors text-left"
                title={`โซน${table.zone}`}
              >
                <div className="p-2 flex items-center gap-3">
                  <TableGraphic number={table.number} capacity={table.capacity} status={table.status} />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
