'use client';

import { useState } from 'react';
import { CartItem } from './POSInterface';
import { useOrders } from '../hooks/useOrders';
import { POSWebSocketService } from '../services/websocketService';

interface PaymentModalProps {
  cart: CartItem[];
  totalAmount: number;
  onClose: () => void;
  onCompletePayment: () => void;
}

export default function PaymentModal({
  cart,
  totalAmount,
  onClose,
  onCompletePayment
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qr'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const { createOrder, loading: orderLoading } = useOrders();
  const posService = POSWebSocketService.getInstance();

  const cashReceivedNum = parseFloat(cashReceived) || 0;
  const change = cashReceivedNum - totalAmount;

  const handlePayment = async () => {
    try {
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        customer_name: customerName || undefined,
        customer_phone: customerPhone || undefined,
        payment_method: paymentMethod,
        total_amount: totalAmount,
        cash_received: paymentMethod === 'cash' ? cashReceivedNum : undefined,
        change: paymentMethod === 'cash' ? change : undefined
      };

        // Create order via API
        const order = await createOrder(orderData);
        console.log('Order created:', order);

        // Send WebSocket message about new order
        posService.sendOrderUpdate({
          orderId: order.id || Date.now(), // Use order ID or timestamp as fallback
          status: 'pending',
          items: orderData.items,
          totalAmount: orderData.total_amount,
          customerName: orderData.customer_name,
          customerPhone: orderData.customer_phone,
          paymentMethod: orderData.payment_method,
          timestamp: new Date().toISOString(),
        });

        // Send system message
        posService.sendSystemMessage(
          `ออเดอร์ใหม่: ${orderData.customer_name || 'ลูกค้าไม่ระบุชื่อ'} - ฿${orderData.total_amount.toLocaleString()}`,
          'info'
        );

        onCompletePayment();
    } catch (error) {
      console.error('Payment failed:', error);
      // Still complete payment for demo purposes
      onCompletePayment();
    }
  };

  const isPaymentValid = () => {
    if (paymentMethod === 'cash') {
      return cashReceivedNum >= totalAmount;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">ชำระเงิน</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">สรุปคำสั่งซื้อ</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product.name} x {item.quantity}
                </span>
                <span className="font-medium">
                  ฿{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>รวมทั้งสิ้น</span>
              <span className="text-green-600">฿{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">ข้อมูลลูกค้า (ไม่บังคับ)</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อลูกค้า
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="ชื่อลูกค้า"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="เบอร์โทรศัพท์"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">วิธีการชำระเงิน</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">เงินสด</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">บัตรเครดิต/เดบิต</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="qr"
                checked={paymentMethod === 'qr'}
                onChange={(e) => setPaymentMethod(e.target.value as 'qr')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">QR Code</span>
            </label>
          </div>
        </div>

        {/* Cash Input */}
        {paymentMethod === 'cash' && (
          <div className="p-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              จำนวนเงินที่รับ
            </label>
            <input
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {cashReceivedNum > 0 && (
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span>เงินทอน:</span>
                  <span className={`font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ฿{change.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Button */}
        <div className="p-6">
          <button
            onClick={handlePayment}
            disabled={!isPaymentValid() || orderLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              isPaymentValid() && !orderLoading
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {orderLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                กำลังประมวลผล...
              </div>
            ) : (
              `ชำระเงิน ฿${totalAmount.toLocaleString()}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
