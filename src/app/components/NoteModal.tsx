'use client';

import { useState } from 'react';

interface NoteModalProps {
  isOpen: boolean;
  productName: string;
  currentNote: string;
  onClose: () => void;
  onConfirm: (note: string) => void;
}

export default function NoteModal({
  isOpen,
  productName,
  currentNote,
  onClose,
  onConfirm
}: NoteModalProps) {
  const [note, setNote] = useState(currentNote);

  const quickNotes = [
    'ไม่เอาแตงกวา',
    'เผ็ดน้อย',
    'เผ็ดปานกลาง',
    'เผ็ดมาก',
    'ไม่ใส่น้ำตาล',
    'น้ำแข็งน้อย',
  ];

  const handleConfirm = () => {
    onConfirm(note);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-[500px] max-w-[90vw] pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-500 text-white rounded-t-xl">
          <h3 className="text-xl font-bold">แก้ไขโน๊ต</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Name */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <p className="text-base text-gray-700 font-medium">{productName}</p>
        </div>

        {/* Note Input */}
        <div className="p-6">
          <label className="block text-base font-semibold text-gray-700 mb-3">โน๊ต</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="พิมพ์โน๊ต..."
            className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg text-gray-900 bg-transparent"
            autoFocus
          />
        </div>

        {/* Quick Notes */}
        <div className="px-6 pb-6">
          <label className="block text-base font-semibold text-gray-700 mb-3">โน๊ตที่ใช้บ่อย</label>
          <div className="grid grid-cols-2 gap-3">
            {quickNotes.map((quickNote, index) => (
              <button
                key={index}
                onClick={() => setNote(quickNote)}
                className="px-4 py-3 border-2 border-blue-300 border-dashed rounded-lg text-gray-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all text-sm font-medium"
              >
                {quickNote}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => setNote('')}
            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            ตั้งค่า
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-blue-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-md"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

