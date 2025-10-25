"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiAdjustmentsHorizontal, HiArrowUpTray, HiBanknotes, HiBars3, HiBell, HiBuildingStorefront, HiCalculator, HiCamera, HiChartBar, HiCheckCircle, HiChevronDown, HiCircleStack, HiClipboard, HiClipboardDocumentList, HiCog, HiCog6Tooth, HiCreditCard, HiCube, HiCurrencyDollar, HiDocument, HiExclamationTriangle, HiFlag, HiFolder, HiHome, HiLockClosed, HiMapPin, HiPencil, HiPlus, HiPresentationChartBar, HiShoppingCart, HiSparkles, HiStar, HiSun, HiTrash, HiUserCircle, HiUsers, HiViewColumns, HiXMark } from "react-icons/hi2";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Profit Calculator States
  const [totalSales, setTotalSales] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);
  const [operatingCost, setOperatingCost] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);
  const [profitResults, setProfitResults] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0
  });

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const calculateProfit = () => {
    const totalRevenue = totalSales + otherIncome;
    const totalExpenses = materialCost + operatingCost + otherExpenses;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    setProfitResults({
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin
    });
  };

  const resetCalculator = () => {
    setTotalSales(0);
    setOtherIncome(0);
    setMaterialCost(0);
    setOperatingCost(0);
    setOtherExpenses(0);
    setProfitResults({
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      profitMargin: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Top Navigation Bar - POSPOS Style */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-full mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            {/* Left Section - Dynamic based on sidebar state */}
            <div className="flex items-center space-x-4">
              {/* Logo with conditional text */}
              {isSidebarOpen ? (
                // Sidebar Open State - Show POPEYE STAKE
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-white font-semibold text-sm">POPEYE</span>
                    <span className="text-white font-semibold text-sm">STAKE</span>
                  </div>
                </div>
              ) : (
                // Sidebar Closed State - Show only P
                <div className="bg-white rounded p-1">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">P</span>
                  </div>
                </div>
              )}
              
              {/* Menu Button with Dropdown */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-white hover:bg-blue-700 px-3 py-2 rounded flex items-center space-x-1"
              >
                <HiBars3 className="w-4 h-4" />
                <HiChevronDown className="w-4 h-4" />
              </button>

              {/* Settings Icon - Only show when sidebar is open */}
              {isSidebarOpen && (
                <button className="text-white hover:bg-blue-700 p-2 rounded">
                                    <HiCog className="w-5 h-5" />
                </button>
              )}

              {/* System Title - Only show when sidebar is open */}
              {isSidebarOpen && (
                <span className="text-white text-sm font-medium">แดชบอร์ด</span>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-right space-x-3">
              {/* Back to Dashboard Button */}
              <button
                onClick={handleBackToDashboard}
                className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              >
                กลับ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          style={{ top: '68px' }}
        />
      )}

      {/* Main Content Layout - Responsive */}
      <div className="flex mt-16">
        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ top: '68px' }}
        >
          <div className="p-3 lg:p-4">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-white hover:text-gray-300"
              >
                                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Trial Status */}
            <div className="w-full flex justify-center mb-4 lg:mb-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-lg p-2 lg:p-3 flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg lg:text-xl">
                    P
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Items */}
            <nav className="space-y-1">
              {[
                {
                  name: "แดชบอร์ด",
                  icon: <HiHome className="w-5 h-5" />,
                  active: activeTab === "dashboard",
                },
                { 
                  name: "รายงาน", 
                  icon: <HiPresentationChartBar className="w-5 h-5" />, 
                  active: activeTab === "reports" 
                },
                {
                  name: "วัตถุดิบ",
                  icon: <HiDocument className="w-5 h-5" />,
                  active: activeTab === "inventory",
                },
                {
                  name: "จัดการเมนู",
                  icon: <HiShoppingCart className="w-5 h-5" />,
                  active: activeTab === "menu",
                },
                {
                  name: "ข้อมูลสินค้า",
                  icon: <HiCube className="w-5 h-5" />,
                  active: activeTab === "menu",
                },
                { 
                  name: "คำนวณกำไร", 
                  icon: <HiCalculator className="w-5 h-5" />, 
                  active: activeTab === "profit" 
                },
                {
                  name: "ข้อมูลร้าน",
                  icon: <HiBuildingStorefront className="w-5 h-5" />,
                  active: activeTab === "settings",
                },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (item.name === "แดชบอร์ด") setActiveTab("dashboard");
                    else if (item.name === "รายงาน") setActiveTab("reports");
                    else if (item.name === "วัตถุดิบ")
                      setActiveTab("inventory");
                    else if (item.name === "ข้อมูลสินค้า") setActiveTab("menu");
                    else if (item.name === "ข้อมูลร้าน")
                      setActiveTab("settings");
                    else if (item.name === "คำนวณกำไร") setActiveTab("profit");
                    else if (item.name === "จัดการเมนู") setActiveTab("menu");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Desktop Sidebar - Toggleable */}
        <div className={`hidden lg:block w-64 bg-blue-800 min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute'
        }`}>
          <div className="p-3 lg:p-4">
            {/* Trial Status */}
            <div className="w-full flex justify-center mb-4 lg:mb-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-lg p-2 lg:p-3 flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg lg:text-xl">
                    P
                  </span>
                </div>
              </div>
            </div>
            {/* Menu Items */}
            <nav className="space-y-1">
              {[
                {
                  name: "แดชบอร์ด",
                  icon: <HiHome className="w-5 h-5" />,
                  active: activeTab === "dashboard",
                },
                {
                  name: "วัตถุดิบ",
                  icon: <HiDocument className="w-5 h-5" />,
                  active: activeTab === "inventory",
                },
                {
                  name: "รายการออเดอร์",
                  icon: <HiClipboard className="w-5 h-5" />,
                  active: activeTab === "orders",
                },
                {
                  name: "ข้อมูลสินค้า",
                  icon: <HiCube className="w-5 h-5" />,
                  active: activeTab === "menu",
                },
                { 
                  name: "คำนวณกำไร", 
                  icon: <HiCalculator className="w-5 h-5" />, 
                  active: activeTab === "profit" 
                },
                { 
                  name: "รายงาน", 
                  icon: <HiPresentationChartBar className="w-5 h-5" />, 
                  active: activeTab === "reports" 
                },
                {
                  name: "ข้อมูลร้าน",
                  icon: <HiBuildingStorefront className="w-5 h-5" />,
                  active: activeTab === "settings",
                },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (item.name === "แดชบอร์ด") setActiveTab("dashboard");
                    else if (item.name === "รายงาน") setActiveTab("reports");
                    else if (item.name === "วัตถุดิบ") setActiveTab("inventory");
                    else if (item.name === "รายการออเดอร์") setActiveTab("orders");
                    else if (item.name === "ข้อมูลสินค้า") setActiveTab("menu");
                    else if (item.name === "คำนวณกำไร") setActiveTab("profit");
                    else if (item.name === "ข้อมูลร้าน")
                      setActiveTab("settings");
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Additional Menu */}
          </div>
        </div>

        {/* Main Content Area - Responsive */}
        <div className={`flex-1 px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 w-full transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
        }`}>
          {/* Dashboard Main View */}
          {activeTab === "dashboard" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Date and Status Bar - Responsive */}
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
                      ยอดขายวันที่ 14/10/2025 15:09
                    </h2>
                  </div>
                </div>
              </div>

              {/* Sales Statistics - Responsive */}
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 text-center">
                  <div className="space-y-1 sm:space-y-2 border-r border-gray-200 pr-2 sm:pr-4">
                    <p className="text-gray-600 text-xs sm:text-sm">ยอดรวม</p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600">
                      ฿0.00
                    </p>
                  </div>
                  <div className="space-y-1 sm:space-y-2 lg:border-r border-gray-200 lg:pr-4">
                    <p className="text-gray-600 text-xs sm:text-sm">
                      การเติบโต
                    </p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-500">
                      0%
                    </p>
                  </div>
                  <div className="space-y-1 sm:space-y-2 border-r border-gray-200 pr-2 sm:pr-4 lg:pr-4">
                    <p className="text-gray-600 text-xs sm:text-sm">ยกเลิก</p>
                    <div className="flex items-center justify-center">
                      <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600">
                        0
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-gray-600 text-xs sm:text-sm">
                      เงินสด/บิล
                    </p>
                    <div className="flex items-center justify-center">
                      <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600">
                        ฿0.00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty State Chart Area - Responsive */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 text-center">
                <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <HiPresentationChartBar className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-gray-300" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                  ไม่มีข้อมูล
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  ยังไม่มีรายการขายในวันนี้ เริ่มต้นใช้งานระบบ POS
                  เพื่อดูข้อมูลการขาย
                </p>

                {/* Action Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => router.push("/")}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    เริ่มขาย
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">
                    ดูการตั้งค่า
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "menu" && (
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                จัดการเมนู
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { name: "เพิ่มเมนูใหม่", icon: <HiPlus className="w-5 h-5" />, color: "bg-green-500" },
                  { name: "แก้ไขเมนู", icon: <HiPencil className="w-5 h-5" />, color: "bg-blue-500" },
                  { name: "ลบเมนู", icon: <HiTrash className="w-5 h-5" />, color: "bg-red-500" },
                  {
                    name: "จัดการหมวดหมู่",
                    icon: <HiFolder className="w-5 h-5" />,
                    color: "bg-purple-500",
                  },
                  {
                    name: "จัดการตัวเลือก",
                    icon: <HiAdjustmentsHorizontal className="w-5 h-5" />,
                    color: "bg-yellow-500",
                  },
                  { name: "อัพโหลดรูปภาพ", icon: <HiCamera className="w-5 h-5" />, color: "bg-indigo-500" },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                  >
                    <div
                      className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl mb-3`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                รายการออเดอร์
              </h2>
              <div className="space-y-4">
                {[
                  {
                    id: "#001",
                    table: "โต๊ะ 1",
                    items: 3,
                    total: "฿150",
                    status: "เสร็จแล้ว",
                    time: "14:30",
                  },
                  {
                    id: "#002",
                    table: "โต๊ะ 5",
                    items: 2,
                    total: "฿89",
                    status: "กำลังทำ",
                    time: "14:25",
                  },
                  {
                    id: "#003",
                    table: "Takeaway",
                    items: 1,
                    total: "฿45",
                    status: "รอชำระ",
                    time: "14:20",
                  },
                ].map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {order.id}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.table}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items} รายการ • {order.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {order.total}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "เสร็จแล้ว"
                            ? "bg-green-100 text-green-800"
                            : order.status === "กำลังทำ"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                รายงาน
              </h2>

              {/* ยอดขายประจำวัน - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-red-400 to-red-600 p-3 sm:p-4 lg:p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-xs sm:text-sm">
                        ยอดขายวันนี้
                      </p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                        ฿2,450
                      </p>
                    </div>
                    <div className="text-red-200">
                      <HiCurrencyDollar className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">การเติบโต</p>
                      <p className="text-2xl font-bold">+12.5%</p>
                    </div>
                    <div className="text-green-200">
                      <HiChartBar className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">ยกเลิก</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="text-yellow-200">
                      <HiXMark className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">กำไรสุทธิ</p>
                      <p className="text-2xl font-bold">฿1,890</p>
                    </div>
                    <div className="text-purple-200">
                      <HiCurrencyDollar className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>

              {/* รายงานต่างๆ */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "รายงานยอดขาย",
                    icon: <HiPresentationChartBar className="w-8 h-8" />,
                    description: "รายงานสรุปยอดขายรายวัน/เดือน/ปี",
                  },
                  {
                    name: "รายงานสินค้า",
                    icon: <HiCube className="w-8 h-8" />,
                    description: "สินค้าขายดี สินค้าคงคลัง",
                  },
                  {
                    name: "รายงานลูกค้า",
                    icon: <HiUsers className="w-8 h-8" />,
                    description: "ข้อมูลลูกค้าและพฤติกรรมการซื้อ",
                  },
                  {
                    name: "รายงานการเงิน",
                    icon: <HiBanknotes className="w-8 h-8" />,
                    description: "กำไร ขาดทุน รายรับ รายจ่าย",
                  },
                  {
                    name: "รายงานพนักงาน",
                    icon: <HiUserCircle className="w-8 h-8" />,
                    description: "ประสิทธิภาพการทำงานของพนักงาน",
                  },
                  {
                    name: "ส่งออกข้อมูล",
                    icon: <HiArrowUpTray className="w-8 h-8" />,
                    description: "ส่งออกรายงานเป็น Excel/PDF",
                  },
                ].map((report, index) => (
                  <button
                    key={index}
                    className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left hover:border-blue-300"
                  >
                    <div className="text-3xl mb-3">{report.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {report.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {report.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* แจ้งเตือน */}
              <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>ข้อมูลตัวอย่าง:</strong>{" "}
                      รายงานนี้แสดงข้อมูลตัวอย่างเท่านั้น
                      ในการใช้งานจริงจะเชื่อมต่อกับฐานข้อมูลของระบบ POS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ตั้งค่า
              </h2>
              <div className="space-y-4">
                {[
                  { name: "ข้อมูลร้าน", icon: <HiBuildingStorefront className="w-5 h-5" /> },
                  { name: "การตั้งค่าการชำระเงิน", icon: <HiCreditCard className="w-5 h-5" /> },
                  { name: "การแจ้งเตือน", icon: <HiBell className="w-5 h-5" /> },
                  { name: "การสำรองข้อมูล", icon: <HiCircleStack className="w-5 h-5" /> },
                  { name: "ผู้ใช้งาน", icon: <HiUsers className="w-5 h-5" /> },
                  { name: "ความปลอดภัย", icon: <HiLockClosed className="w-5 h-5" /> },
                ].map((setting, index) => (
                  <button
                    key={index}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-4">{setting.icon}</span>
                      <span className="font-medium text-gray-900">
                        {setting.name}
                      </span>
                      <HiChevronDown className="w-5 h-5 ml-auto text-gray-400 -rotate-90" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                คลังสินค้า / วัตถุดิบ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "เพิ่มวัตถุดิบใหม่",
                    icon: <HiPlus className="w-5 h-5" />,
                    color: "bg-green-500",
                  },
                  { name: "จัดการสต็อก", icon: <HiCube className="w-5 h-5" />, color: "bg-blue-500" },
                  {
                    name: "ตรวจสอบคงเหลือ",
                    icon: <HiPresentationChartBar className="w-5 h-5" />,
                    color: "bg-purple-500",
                  },
                  { name: "ประวัติการใช้", icon: <HiClipboardDocumentList className="w-5 h-5" />, color: "bg-orange-500" },
                  {
                    name: "แจ้งเตือนสต็อกต่ำ",
                    icon: <HiExclamationTriangle className="w-5 h-5" />,
                    color: "bg-red-500",
                  },
                  {
                    name: "รายงานการใช้วัตถุดิบ",
                    icon: <HiChartBar className="w-5 h-5" />,
                    color: "bg-indigo-500",
                  },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                  >
                    <div
                      className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl mb-3`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                  </button>
                ))}
              </div>

              {/* สถิติคลังสินค้า */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">
                        รายการวัตถุดิบทั้งหมด
                      </p>
                      <p className="text-2xl font-bold">25</p>
                    </div>
                    <div className="text-blue-200">
                      <HiCube className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">สต็อกต่ำ</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="text-yellow-200">
                      <HiExclamationTriangle className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">มูลค่าคลังสินค้า</p>
                      <p className="text-2xl font-bold">฿15,240</p>
                    </div>
                    <div className="text-green-200">
                      <HiCurrencyDollar className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profit" && (
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                คำนวณกำไร
              </h2>

              {/* Profit Calculator Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">ข้อมูลรายรับ</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ยอดขายรวม (บาท)
                    </label>
                    <input
                      type="number"
                      value={totalSales}
                      onChange={(e) => setTotalSales(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      รายได้อื่นๆ (บาท)
                    </label>
                    <input
                      type="number"
                      value={otherIncome}
                      onChange={(e) => setOtherIncome(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">ข้อมูลค่าใช้จ่าย</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ต้นทุนวัตถุดิบ (บาท)
                    </label>
                    <input
                      type="number"
                      value={materialCost}
                      onChange={(e) => setMaterialCost(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ค่าใช้จ่ายดำเนินงาน (บาท)
                    </label>
                    <input
                      type="number"
                      value={operatingCost}
                      onChange={(e) => setOperatingCost(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ค่าใช้จ่ายอื่นๆ (บาท)
                    </label>
                    <input
                      type="number"
                      value={otherExpenses}
                      onChange={(e) => setOtherExpenses(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Example Button */}
              <div className="mt-6 text-center">
                <button 
                  onClick={() => {
                    setTotalSales(10000);
                    setOtherIncome(500);
                    setMaterialCost(3500);
                    setOperatingCost(2000);
                    setOtherExpenses(1000);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                >
                  ใส่ข้อมูลตัวอย่าง
                </button>
              </div>

              {/* Calculate Button */}
              <div className="mt-6 text-center space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <button 
                  onClick={calculateProfit}
                  className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  คำนวณกำไร
                </button>
                <button 
                  onClick={resetCalculator}
                  className="w-full sm:w-auto bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  รีเซ็ต
                </button>
              </div>

              {/* Profit Summary */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 rounded-lg text-white text-center">
                  <p className="text-green-100 text-xs sm:text-sm">รายรับรวม</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    ฿{profitResults.totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-6 rounded-lg text-white text-center">
                  <p className="text-red-100 text-xs sm:text-sm">ค่าใช้จ่ายรวม</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    ฿{profitResults.totalExpenses.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className={`bg-gradient-to-r p-4 sm:p-6 rounded-lg text-white text-center ${
                  profitResults.netProfit >= 0 
                    ? 'from-blue-500 to-blue-600' 
                    : 'from-orange-500 to-orange-600'
                }`}>
                  <p className={`text-xs sm:text-sm ${
                    profitResults.netProfit >= 0 ? 'text-blue-100' : 'text-orange-100'
                  }`}>
                    {profitResults.netProfit >= 0 ? 'กำไรสุทธิ' : 'ขาดทุน'}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    ฿{Math.abs(profitResults.netProfit).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className={`text-xs mt-1 ${
                    profitResults.netProfit >= 0 ? 'text-blue-200' : 'text-orange-200'
                  }`}>
                    {profitResults.profitMargin.toFixed(1)}% margin
                  </p>
                </div>
              </div>

              {/* Profit Analysis */}
              {profitResults.totalRevenue > 0 && (
                <div className="mt-8 bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">การวิเคราะห์รายละเอียด</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">ต้นทุนวัตถุดิบ</p>
                      <p className="font-semibold text-gray-900">
                        {((materialCost / profitResults.totalRevenue) * 100).toFixed(1)}% ของรายรับ
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">ค่าดำเนินงาน</p>
                      <p className="font-semibold text-gray-900">
                        {((operatingCost / profitResults.totalRevenue) * 100).toFixed(1)}% ของรายรับ
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Break-even Point</p>
                      <p className="font-semibold text-gray-900">
                        ฿{profitResults.totalExpenses.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">ROI</p>
                      <p className="font-semibold text-gray-900">
                        {profitResults.totalExpenses > 0 
                          ? ((profitResults.netProfit / profitResults.totalExpenses) * 100).toFixed(1) 
                          : '0'}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Profit Analysis Tools */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">เครื่องมือวิเคราะห์กำไร</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { name: "วิเคราะห์กำไรตามรายการ", icon: <HiPresentationChartBar className="w-5 h-5" />, color: "bg-blue-500" },
                    { name: "เปรียบเทียบรายเดือน", icon: <HiChartBar className="w-5 h-5" />, color: "bg-green-500" },
                    { name: "วิเคราะห์ต้นทุน", icon: <HiBanknotes className="w-5 h-5" />, color: "bg-purple-500" },
                    { name: "คาดการณ์กำไร", icon: <HiSparkles className="w-5 h-5" />, color: "bg-indigo-500" },
                    { name: "รายงานกำไร-ขาดทุน", icon: <HiClipboardDocumentList className="w-5 h-5" />, color: "bg-orange-500" },
                    { name: "ส่งออกข้อมูล", icon: <HiArrowUpTray className="w-5 h-5" />, color: "bg-gray-500" },
                  ].map((tool, index) => (
                    <button
                      key={index}
                      className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                    >
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 ${tool.color} rounded-lg flex items-center justify-center text-white text-sm sm:text-lg mb-2`}
                      >
                        {tool.icon}
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{tool.name}</h4>
                    </button>
                  ))}
                </div>
              </div>

              {/* Profit Tips */}
              <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <HiStar className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">เคล็ดลับเพิ่มกำไร</h4>
                    <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside space-y-1">
                      <li>ติดตามต้นทุนวัตถุดิบอย่างสม่ำเสมอ</li>
                      <li>วิเคราะห์เมนูที่มีกำไรสูงและต่ำ</li>
                      <li>ควบคุมค่าใช้จ่ายที่ไม่จำเป็น</li>
                      <li>ปรับราคาขายให้เหมาะสมกับต้นทุน</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
