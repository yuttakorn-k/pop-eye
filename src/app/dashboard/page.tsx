'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handlePOSClick = () => {
    router.push('/');
  };

  const handleAdminClick = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ระบบจัดการร้านอาหาร
          </h1>
          <p className="text-gray-600">
            เลือกระบบที่ต้องการใช้งาน
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* POS - หน้าบ้าน */}
          <button
            onClick={handlePOSClick}
            className="group p-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white"
          >
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h5v-6h2v6h5a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">POS System</h2>
              <p className="text-green-100">
                ระบบขายหน้าร้าน<br />
                รับออเดอร์และชำระเงิน
              </p>
            </div>
          </button>

          {/* Admin - หลังบ้าน */}
          <button
            onClick={handleAdminClick}
            className="group p-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white"
          >
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
              <p className="text-purple-100">
                ระบบจัดการหลังบ้าน<br />
                จัดการเมนูและรายงาน
              </p>
            </div>
          </button>
        </div>

        {/* Logout Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              router.push('/login');
            }}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
