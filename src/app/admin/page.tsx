'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('menu');

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={handleBackToDashboard}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="text-sm text-gray-500">
              ระบบจัดการหลังบ้าน
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'menu', name: 'จัดการเมนู', icon: '🍽️' },
              { id: 'orders', name: 'รายการออเดอร์', icon: '📋' },
              { id: 'reports', name: 'รายงาน', icon: '📊' },
              { id: 'settings', name: 'ตั้งค่า', icon: '⚙️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'menu' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">จัดการเมนู</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'เพิ่มเมนูใหม่', icon: '➕', color: 'bg-green-500' },
                { name: 'แก้ไขเมนู', icon: '✏️', color: 'bg-blue-500' },
                { name: 'ลบเมนู', icon: '🗑️', color: 'bg-red-500' },
                { name: 'จัดการหมวดหมู่', icon: '📁', color: 'bg-purple-500' },
                { name: 'จัดการตัวเลือก', icon: '⚙️', color: 'bg-yellow-500' },
                { name: 'อัพโหลดรูปภาพ', icon: '📷', color: 'bg-indigo-500' },
              ].map((item, index) => (
                <button
                  key={index}
                  className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                >
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
                    {item.icon}
                  </div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">รายการออเดอร์</h2>
            <div className="space-y-4">
              {[
                { id: '#001', table: 'โต๊ะ 1', items: 3, total: '฿150', status: 'เสร็จแล้ว', time: '14:30' },
                { id: '#002', table: 'โต๊ะ 5', items: 2, total: '฿89', status: 'กำลังทำ', time: '14:25' },
                { id: '#003', table: 'Takeaway', items: 1, total: '฿45', status: 'รอชำระ', time: '14:20' },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{order.id}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.table}</p>
                      <p className="text-sm text-gray-500">{order.items} รายการ • {order.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.total}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'เสร็จแล้ว' ? 'bg-green-100 text-green-800' :
                      order.status === 'กำลังทำ' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">รายงาน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'ยอดขายวันนี้', value: '฿12,450', change: '+5.2%', color: 'text-green-600' },
                { title: 'จำนวนออเดอร์', value: '89', change: '+12', color: 'text-blue-600' },
                { title: 'ลูกค้าเฉลี่ย', value: '฿140', change: '+2.1%', color: 'text-purple-600' },
                { title: 'เมนูยอดนิยม', value: 'สลัดผัก', change: '23 ครั้ง', color: 'text-orange-600' },
              ].map((stat, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ตั้งค่า</h2>
            <div className="space-y-4">
              {[
                { name: 'ข้อมูลร้าน', icon: '🏪' },
                { name: 'การตั้งค่าการชำระเงิน', icon: '💳' },
                { name: 'การแจ้งเตือน', icon: '🔔' },
                { name: 'การสำรองข้อมูล', icon: '💾' },
                { name: 'ผู้ใช้งาน', icon: '👥' },
                { name: 'ความปลอดภัย', icon: '🔒' },
              ].map((setting, index) => (
                <button
                  key={index}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{setting.icon}</span>
                    <span className="font-medium text-gray-900">{setting.name}</span>
                    <svg className="w-5 h-5 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
