"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiAdjustmentsHorizontal, HiArrowUpTray, HiBanknotes, HiBars3, HiBell, HiBuildingStorefront, HiCalculator, HiCamera, HiChartBar, HiCheckCircle, HiChevronDown, HiCircleStack, HiClipboard, HiClipboardDocumentList, HiCog, HiCog6Tooth, HiCreditCard, HiCube, HiCurrencyDollar, HiDocument, HiExclamationTriangle, HiFlag, HiFolder, HiHome, HiLockClosed, HiMapPin, HiPencil, HiPlus, HiPresentationChartBar, HiShoppingCart, HiSparkles, HiStar, HiSun, HiTrash, HiUserCircle, HiUsers, HiViewColumns, HiXMark } from "react-icons/hi2";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [isFullReportModalOpen, setIsFullReportModalOpen] = useState(false);
  const [isFullReportModalClosing, setIsFullReportModalClosing] = useState(false);
  
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

  // Orders data with detailed items
  const ordersData = [
    {
      id: "#001",
      table: "โต๊ะ 1",
      items: 3,
      itemList: "สเต็กเนื้อ, น้ำอัดลม, เฟรนช์ฟราย",
      itemDetails: [
        { name: "สเต็กเนื้อ", quantity: 1, price: 180 },
        { name: "น้ำอัดลม", quantity: 1, price: 35 },
        { name: "เฟรนช์ฟราย", quantity: 1, price: 35 },
      ],
      total: "฿250",
      totalNum: 250,
      status: "เสร็จแล้ว",
      time: "13:45",
    },
    {
      id: "#002",
      table: "โต๊ะ 5",
      items: 2,
      itemList: "สเต็กหมู, สลัดผัก",
      itemDetails: [
        { name: "สเต็กหมู", quantity: 1, price: 159 },
        { name: "สลัดผัก", quantity: 1, price: 30 },
      ],
      total: "฿189",
      totalNum: 189,
      status: "เสร็จแล้ว",
      time: "13:30",
    },
    {
      id: "#003",
      table: "โต๊ะ 3",
      items: 4,
      itemList: "สเต็กไก่, ข้าวผัด, น้ำส้ม, ไอศกรีม",
      itemDetails: [
        { name: "สเต็กไก่", quantity: 1, price: 149 },
        { name: "ข้าวผัด", quantity: 1, price: 80 },
        { name: "น้ำส้ม", quantity: 1, price: 40 },
        { name: "ไอศกรีม", quantity: 1, price: 51 },
      ],
      total: "฿320",
      totalNum: 320,
      status: "เสร็จแล้ว",
      time: "13:15",
    },
    {
      id: "#004",
      table: "Takeaway",
      items: 1,
      itemList: "สเต็กเนื้อ",
      itemDetails: [
        { name: "สเต็กเนื้อ", quantity: 1, price: 180 },
      ],
      total: "฿180",
      totalNum: 180,
      status: "เสร็จแล้ว",
      time: "12:50",
    },
    {
      id: "#005",
      table: "โต๊ะ 7",
      items: 2,
      itemList: "สเต็กแซลมอน, น้ำมะนาว",
      itemDetails: [
        { name: "สเต็กแซลมอน", quantity: 1, price: 240 },
        { name: "น้ำมะนาว", quantity: 1, price: 40 },
      ],
      total: "฿280",
      totalNum: 280,
      status: "เสร็จแล้ว",
      time: "12:30",
    },
    {
      id: "#006",
      table: "โต๊ะ 2",
      items: 3,
      itemList: "สเต็กหมู, สลัดซีซาร์, น้ำอัดลม",
      itemDetails: [
        { name: "สเต็กหมู", quantity: 1, price: 159 },
        { name: "สลัดซีซาร์", quantity: 1, price: 31 },
        { name: "น้ำอัดลม", quantity: 1, price: 35 },
      ],
      total: "฿225",
      totalNum: 225,
      status: "เสร็จแล้ว",
      time: "12:15",
    },
  ];

  // Calculate item sales statistics
  const calculateItemSales = () => {
    const itemSales: { [key: string]: { quantity: number; revenue: number } } = {};
    
    ordersData.forEach(order => {
      order.itemDetails.forEach(item => {
        if (!itemSales[item.name]) {
          itemSales[item.name] = { quantity: 0, revenue: 0 };
        }
        itemSales[item.name].quantity += item.quantity;
        itemSales[item.name].revenue += item.price * item.quantity;
      });
    });

    return Object.entries(itemSales)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quantity - a.quantity); // Sort by quantity sold (best sellers first)
  };

  const itemSalesData = calculateItemSales();

  // Calculate dashboard data
  const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalNum, 0);
  const totalOrders = ordersData.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Chart data for different periods
  const chartData = {
    hourly: [
      { label: '9:00', sales: 180, orders: 2 },
      { label: '10:00', sales: 250, orders: 3 },
      { label: '11:00', sales: 320, orders: 4 },
      { label: '12:00', sales: 480, orders: 6 },
      { label: '13:00', sales: 380, orders: 5 },
      { label: '14:00', sales: 420, orders: 4 },
      { label: '15:00', sales: 280, orders: 3 },
      { label: '16:00', sales: 350, orders: 4 }
    ],
    daily: [
      { label: 'จ.', sales: 1200, orders: 8 },
      { label: 'อ.', sales: 1350, orders: 9 },
      { label: 'พ.', sales: 980, orders: 6 },
      { label: 'พฤ.', sales: 1580, orders: 11 },
      { label: 'ศ.', sales: 1420, orders: 10 },
      { label: 'ส.', sales: 1680, orders: 12 },
      { label: 'อา.', sales: totalRevenue, orders: totalOrders }
    ],
    weekly: [
      { label: 'สัปดาห์ 1', sales: 8500, orders: 58 },
      { label: 'สัปดาห์ 2', sales: 9200, orders: 64 },
      { label: 'สัปดาห์ 3', sales: 7800, orders: 52 },
      { label: 'สัปดาห์ 4', sales: 10100, orders: 71 }
    ],
    monthly: [
      { label: 'ม.ค.', sales: 35000, orders: 245 },
      { label: 'ก.พ.', sales: 32000, orders: 220 },
      { label: 'มี.ค.', sales: 38000, orders: 265 },
      { label: 'เม.ย.', sales: 36000, orders: 250 },
      { label: 'พ.ค.', sales: 41000, orders: 285 },
      { label: 'มิ.ย.', sales: 39000, orders: 270 },
      { label: 'ก.ค.', sales: 42000, orders: 295 },
      { label: 'ส.ค.', sales: 40000, orders: 280 },
      { label: 'ก.ย.', sales: 37000, orders: 260 },
      { label: 'ต.ค.', sales: 35000, orders: 245 },
      { label: 'พ.ย.', sales: totalRevenue * 30, orders: totalOrders * 30 } // Current month estimate
    ]
  };

  const periodLabels = {
    hourly: 'รายชั่วโมง (วันนี้)',
    daily: 'รายวัน (7 วันล่าสุด)', 
    weekly: 'รายสัปดาห์ (เดือนนี้)',
    monthly: 'รายเดือน (ปีนี้)'
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setIsOrderModalOpen(false);
      setIsModalClosing(false);
      setSelectedOrder(null);
    }, 200);
  };

  const handleCloseFullReportModal = () => {
    setIsFullReportModalClosing(true);
    setTimeout(() => {
      setIsFullReportModalOpen(false);
      setIsFullReportModalClosing(false);
    }, 200);
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
                      ยอดขายวันที่ 5/11/2025 {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
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
                      ฿{totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1 sm:space-y-2 lg:border-r border-gray-200 lg:pr-4">
                    <p className="text-gray-600 text-xs sm:text-sm">
                      จำนวนออเดอร์
                    </p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-500">
                      {totalOrders}
                    </p>
                  </div>
                  <div className="space-y-1 sm:space-y-2 border-r border-gray-200 pr-2 sm:pr-4 lg:pr-4">
                    <p className="text-gray-600 text-xs sm:text-sm">เฉลี่ย/บิล</p>
                    <div className="flex items-center justify-center">
                      <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600">
                        ฿{Math.round(avgOrderValue)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-gray-600 text-xs sm:text-sm">
                      สินค้า/บิล
                    </p>
                    <div className="flex items-center justify-center">
                      <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-orange-600">
                        {Math.round(ordersData.reduce((sum, order) => sum + order.items, 0) / totalOrders) || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Sales Chart Block */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                      กราฟสินค้าขายดี
                    </h3>
                    <HiPresentationChartBar className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  {/* Professional Chart with Recharts */}
                  <div className="mb-6">
                    {/* Chart Title and Controls */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">แผนภูมิยอดขาย</p>
                        <p className="text-xs text-gray-500">{periodLabels[chartPeriod]}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Period Selection Buttons */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          {[
                            { key: 'hourly', label: 'รายชั่วโมง' },
                            { key: 'daily', label: 'รายวัน' },
                            { key: 'weekly', label: 'รายสัปดาห์' },
                            { key: 'monthly', label: 'รายเดือน' }
                          ].map((period) => (
                            <button
                              key={period.key}
                              onClick={() => setChartPeriod(period.key as any)}
                              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                chartPeriod === period.key
                                  ? 'bg-blue-500 text-white'
                                  : 'text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {period.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recharts Bar Chart */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                          data={chartData[chartPeriod]}
                          margin={{
                            top: 20,
                            right: 20,
                            left: 20,
                            bottom: 20,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                          <XAxis 
                            dataKey="label"
                            axisLine={{ stroke: '#6b7280' }}
                            tickLine={{ stroke: '#6b7280' }}
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                          />
                          <YAxis 
                            axisLine={{ stroke: '#6b7280' }}
                            tickLine={{ stroke: '#6b7280' }}
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                            width={60}
                            tickFormatter={(value) => {
                              if (chartPeriod === 'hourly') return `฿${value}`;
                              if (chartPeriod === 'daily') return `฿${(value/1000).toFixed(1)}k`;
                              if (chartPeriod === 'weekly') return `฿${(value/1000).toFixed(1)}k`;
                              return `฿${(value/1000).toFixed(0)}k`;
                            }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: 'none',
                              borderRadius: '8px',
                              color: 'white',
                              fontSize: '12px'
                            }}
                            formatter={(value: any, name: string) => [
                              name === 'sales' ? `฿${value.toLocaleString()}` : `${value} ออเดอร์`,
                              name === 'sales' ? 'ยอดขาย' : 'จำนวนออเดอร์'
                            ]}
                            labelFormatter={(label: any) => {
                              const periodTitles = {
                                hourly: `เวลา ${label}`,
                                daily: `วัน${label}`,
                                weekly: `${label}`,
                                monthly: `เดือน ${label}`
                              };
                              return periodTitles[chartPeriod] || label;
                            }}
                          />
                          <Bar 
                            dataKey="sales" 
                            fill="url(#colorGradient)"
                            radius={[4, 4, 0, 0]}
                            stroke="#e5e7eb"
                            strokeWidth={1}
                          />
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                      
                      {/* X-Axis Label */}
                      <div className="text-center mt-2">
                        <p className="text-xs text-gray-500">
                          {chartPeriod === 'hourly' && 'ช่วงเวลา (วันนี้)'}
                          {chartPeriod === 'daily' && 'วันในสัปดาห์ (7 วันล่าสุด)'}
                          {chartPeriod === 'weekly' && 'สัปดาห์ในเดือน (เดือนนี้)'}
                          {chartPeriod === 'monthly' && 'เดือนในปี (ปีนี้)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Items Block */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                      สินค้าขายดี
                    </h3>
                    <HiStar className="w-6 h-6 text-yellow-500" />
                  </div>
                  
                  {/* Best Selling Items List */}
                  <div className="space-y-3 mb-6">
                    {itemSalesData.slice(0, 5).map((item, index) => {
                      const rankColors = [
                        'bg-yellow-100 text-yellow-600 border-yellow-200', // 1st
                        'bg-gray-100 text-gray-600 border-gray-200',       // 2nd
                        'bg-orange-100 text-orange-600 border-orange-200', // 3rd
                        'bg-blue-100 text-blue-600 border-blue-200',       // 4th
                        'bg-green-100 text-green-600 border-green-200'     // 5th
                      ];
                      const icons = [
                        <HiStar className="w-3 h-3" />,
                        <HiStar className="w-3 h-3" />,
                        <HiStar className="w-3 h-3" />,
                        <HiCheckCircle className="w-3 h-3" />,
                        <HiCheckCircle className="w-3 h-3" />
                      ];
                      
                      return (
                        <div
                          key={item.name}
                          className={`w-full flex items-center justify-between p-3 border rounded-lg ${rankColors[index]} transition-colors`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${rankColors[index]}`}>
                              <div className="flex items-center space-x-1">
                                {icons[index]}
                                <span className="text-xs font-bold">#{index + 1}</span>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-500">ขายแล้ว {item.quantity} ชิ้น</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-sm">฿{item.revenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">รายได้</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setIsFullReportModalOpen(true)}
                      className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                    >
                      รายงานเต็ม
                    </button>
                  </div>
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
                {ordersData.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsOrderModalOpen(true);
                    }}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
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
                  </button>
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

      {/* Order Details Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div 
          className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
            isModalClosing ? 'animate-fade-out' : 'animate-fade-in'
          }`}
          onClick={handleCloseModal}
        >
          <div 
            className={`bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300 ${
              isModalClosing ? 'animate-scale-out' : 'animate-scale-in'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                รายละเอียดออเดอร์ {selectedOrder.id}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Order Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">โต๊ะ:</span>
                  <span className="font-medium">{selectedOrder.table}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">เวลา:</span>
                  <span className="font-medium">{selectedOrder.time}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">สถานะ:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedOrder.status === "เสร็จแล้ว"
                        ? "bg-green-100 text-green-800"
                        : selectedOrder.status === "กำลังทำ"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ยอดรวม:</span>
                  <span className="font-bold text-lg text-blue-600">{selectedOrder.total}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">รายการสินค้า:</h4>
                <div className="space-y-2">
                  {selectedOrder.itemList.split(', ').map((item: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item}</span>
                      <HiCheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-2 p-4 border-t">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Sales Report Modal */}
      {isFullReportModalOpen && (
        <div 
          className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
            isFullReportModalClosing ? 'animate-fade-out' : 'animate-fade-in'
          }`}
          onClick={handleCloseFullReportModal}
        >
          <div 
            className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300 ${
              isFullReportModalClosing ? 'animate-scale-out' : 'animate-scale-in'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <HiPresentationChartBar className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    รายงานสินค้าขายดี
                  </h3>
                  <p className="text-sm text-gray-500">
                    รายการสินค้าทั้งหมดจัดอันดับตามยอดขาย
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseFullReportModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {itemSalesData.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                  <p className="text-sm text-blue-600">ชิ้นทั้งหมด</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ฿{itemSalesData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">รายได้รวม</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {itemSalesData.length}
                  </p>
                  <p className="text-sm text-purple-600">รายการสินค้า</p>
                </div>
              </div>

              {/* Full Items List */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 mb-4">รายการสินค้าจัดอันดับ</h4>
                {itemSalesData.map((item, index) => {
                  const rankColors = [
                    'bg-yellow-100 text-yellow-600 border-yellow-200', // 1st
                    'bg-gray-100 text-gray-600 border-gray-200',       // 2nd
                    'bg-orange-100 text-orange-600 border-orange-200', // 3rd
                    'bg-blue-100 text-blue-600 border-blue-200',       // 4th+
                    'bg-green-100 text-green-600 border-green-200'     // 5th+
                  ];
                  const colorIndex = index < 3 ? index : (index < 5 ? 3 : 4);
                  const icons = [
                    <HiStar className="w-4 h-4" />,
                    <HiStar className="w-4 h-4" />,
                    <HiStar className="w-4 h-4" />,
                    <HiCheckCircle className="w-4 h-4" />,
                    <HiCheckCircle className="w-4 h-4" />
                  ];
                  
                  return (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between p-4 border rounded-lg ${rankColors[colorIndex]} transition-colors hover:shadow-md`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${rankColors[colorIndex]}`}>
                          <div className="flex items-center space-x-1">
                            {icons[colorIndex]}
                            <span className="text-sm font-bold">#{index + 1}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-base">{item.name}</p>
                          <p className="text-sm text-gray-500">ขายแล้ว {item.quantity} ชิ้น</p>
                          <p className="text-xs text-gray-400">
                            คิดเป็น {((item.quantity / itemSalesData.reduce((sum, i) => sum + i.quantity, 0)) * 100).toFixed(1)}% ของยอดขายทั้งหมด
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-lg">฿{item.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">รายได้</p>
                        <p className="text-xs text-gray-400">
                          ฿{Math.round(item.revenue / item.quantity)} ต่อชิ้น
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-500">
                ข้อมูล ณ วันที่ 5 พฤศจิกายน 2025
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setActiveTab("reports")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  ดูรายงานเต็ม
                </button>
                <button
                  onClick={handleCloseFullReportModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
