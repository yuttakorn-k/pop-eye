"use client";

interface POSFooterProps {
  onClearCart: () => void;
  onOpenCustomer: () => void;
  onOpenRegister: () => void;
  onCheckout: () => void;
  onOpenSummary: () => void;
}

export default function POSFooter({
  onClearCart,
  onOpenCustomer,
  onOpenRegister,
  onCheckout,
  onOpenSummary,
}: POSFooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-lg">
      <div className="px-3 md:px-6 py-3">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <button
            onClick={onClearCart}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 transition-all shadow-sm hover:shadow whitespace-nowrap min-w-0"
          >
            <span className="text-xl">🗑️</span>
            <div className="leading-tight text-left hidden md:block">
              <div className="font-semibold text-sm">เคลียร์</div>
            </div>
            <div className="leading-tight text-center md:hidden">
              <div className="font-semibold text-xs">เคลียร์</div>
            </div>
          </button>

          <button
            onClick={onOpenCustomer}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow whitespace-nowrap min-w-0"
          >
            <span className="text-xl">👥</span>
            <div className="leading-tight text-left hidden md:block">
              <div className="font-semibold text-sm">ลูกค้า</div>
            </div>
            <div className="leading-tight text-center md:hidden">
              <div className="font-semibold text-xs">ลูกค้า</div>
            </div>
          </button>

          <button
            onClick={onOpenRegister}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow whitespace-nowrap min-w-0"
          >
            <span className="text-xl">🧾</span>
            <div className="leading-tight text-left hidden md:block">
              <div className="font-semibold text-sm">สลิป/บิล</div>
            </div>
            <div className="leading-tight text-center md:hidden">
              <div className="font-semibold text-xs">สลิป/บิล</div>
            </div>
          </button>

          <button
            onClick={onCheckout}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow whitespace-nowrap min-w-0"
          >
            <span className="text-xl">🛒</span>
            <div className="leading-tight text-left hidden md:block">
              <div className="font-semibold text-sm">พัก</div>
            </div>
            <div className="leading-tight text-center md:hidden">
              <div className="font-semibold text-xs">พัก</div>
            </div>
          </button>

          <button
            onClick={onOpenSummary}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow whitespace-nowrap min-w-0"
          >
            <span className="text-xl">🧮</span>
            <div className="leading-tight text-left hidden md:block">
              <div className="font-semibold text-sm">สรุป</div>
              <div className="text-xs text-gray-400">&nbsp;</div>
            </div>
            <div className="leading-tight text-center md:hidden">
              <div className="font-semibold text-xs">สรุป</div>
            </div>
          </button>

          <button
            onClick={() => console.log('more actions')}
            className="flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow"
            aria-label="เพิ่มเติม"
          >
            <span className="text-xl">⋮</span>
          </button>
        </div>
      </div>
    </footer>
  );
}


