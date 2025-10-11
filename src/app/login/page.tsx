'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // ตัวอย่าง PIN ที่ถูกต้อง (ในระบบจริงควรมาจาก API หรือ database)
  const validPIN = '123456';

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pinString = pin.join('');
    if (pinString === validPIN) {
      // Set login status in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      // Redirect to dashboard after successful login
      router.push('/dashboard');
      setError('');
    } else {
      setError('PIN ไม่ถูกต้อง');
      setPin(['', '', '', '', '', '']);
    }
  };

  const handlePinInput = (index: number, value: string) => {
    // รับได้แค่ตัวเลข
    if (!/^\d$/.test(value) && value !== '') return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto focus ไปช่องถัดไป
    if (value !== '' && index < 5) {
      setFocusedIndex(index + 1);
    }
  };

  const handlePinFocus = (index: number) => {
    setFocusedIndex(index);
    setShowKeypad(true);
  };

  const handleKeypadInput = (digit: string) => {
    const newPin = [...pin];
    newPin[focusedIndex] = digit;
    setPin(newPin);
    setError('');

    // Auto focus ไปช่องถัดไป
    if (focusedIndex < 5) {
      setFocusedIndex(focusedIndex + 1);
    }
  };

  const handleKeypadBackspace = () => {
    const newPin = [...pin];
    if (newPin[focusedIndex] !== '') {
      newPin[focusedIndex] = '';
    } else if (focusedIndex > 0) {
      setFocusedIndex(focusedIndex - 1);
      newPin[focusedIndex - 1] = '';
    }
    setPin(newPin);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace - ลบและไปช่องก่อนหน้า
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const clearPin = () => {
    setPin(['', '', '', '', '', '']);
    setError('');
    setFocusedIndex(0);
    setShowKeypad(true);
  };

  const toggleShowPin = () => {
    setShowPin(!showPin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ระบบ POS</h1>
          <p className="text-gray-600">กรุณาใส่ PIN เพื่อเข้าสู่ระบบ</p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              PIN Code (6 หลัก)
            </label>
            
            {/* PIN Input Fields */}
            <div className="flex justify-center gap-3 mb-4">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type={showPin ? "text" : "password"}
                  value={digit}
                  onChange={(e) => handlePinInput(index, e.target.value)}
                  onFocus={() => handlePinFocus(index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-xl font-mono border-2 rounded-lg focus:ring-0 transition-colors ${
                    index === focusedIndex 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-300 focus:border-orange-500'
                  }`}
                  maxLength={1}
                  autoComplete="off"
                  readOnly
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mb-4">
              <button
                type="button"
                onClick={toggleShowPin}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="text-lg">👁️</span>
                {showPin ? 'ซ่อน PIN' : 'แสดง PIN'}
              </button>
              <button
                type="button"
                onClick={clearPin}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="text-lg">🗑️</span>
                ล้างข้อมูล
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={pin.some(digit => digit === '')}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Virtual Keypad - Center screen */}
        {showKeypad && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowKeypad(false)}
            ></div>
            
            {/* Keypad */}
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-lg mx-auto transform transition-transform duration-300 ease-out animate-slide-up">
              {/* Handle bar */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
              
              {/* Keypad Grid */}
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeypadInput(num.toString())}
                    className="w-24 h-24 bg-gray-100 border-2 border-gray-200 rounded-2xl text-4xl font-bold text-gray-800 hover:bg-gray-200 hover:border-gray-300 active:bg-gray-300 transition-colors"
                  >
                    {num}
                  </button>
                ))}
                
                {/* Empty space for 0 */}
                <div></div>
                
                {/* 0 button */}
                <button
                  type="button"
                  onClick={() => handleKeypadInput('0')}
                  className="w-24 h-24 bg-gray-100 border-2 border-gray-200 rounded-2xl text-4xl font-bold text-gray-800 hover:bg-gray-200 hover:border-gray-300 active:bg-gray-300 transition-colors"
                >
                  0
                </button>
                
                {/* Backspace button */}
                <button
                  type="button"
                  onClick={handleKeypadBackspace}
                  className="w-24 h-24 bg-red-100 border-2 border-red-200 rounded-2xl text-3xl font-bold text-red-600 hover:bg-red-200 hover:border-red-300 active:bg-red-300 transition-colors"
                >
                  ⌫
                </button>
              </div>
              
              {/* Close button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowKeypad(false)}
                  className="px-12 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-lg font-semibold"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            PIN ตัวอย่าง: 123456
          </p>
        </div>
      </div>
    </div>
  );
}
