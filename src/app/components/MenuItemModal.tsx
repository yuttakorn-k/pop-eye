"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Divider,
  Input,
  Textarea,
} from "@heroui/react";
import Image from "next/image";

type Option = {
  name: string;
  price: number;
};

type AddonGroup = {
  groupName: string;
  required: boolean;
  max: number;
  options: Option[];
};

export type MenuItemForModal = {
  id: number;
  name_th: string;
  name_en?: string;
  price: number;
  image: string;
  is_recommended?: boolean;
  addons?: AddonGroup[];
  description?: string;
};

type Props = {
  open: boolean;
  item: MenuItemForModal | null;
  quantity: number;
  note: string;
  selectedAddons: { [group: string]: string[] };
  onClose: () => void;
  onChangeQuantity: (next: number) => void;
  onToggleAddon: (group: string, option: string, checked: boolean, max: number) => void;
  onChangeNote: (value: string) => void;
  onConfirm: () => void;
  totalPrice: number;
};

export default function MenuItemModal({
  open,
  item,
  quantity,
  note,
  selectedAddons,
  onClose,
  onChangeQuantity,
  onToggleAddon,
  onChangeNote,
  onConfirm,
  totalPrice,
}: Props) {
  if (!item) return null;

  const allGroups = item.addons || [];
  const canConfirm = allGroups.length === 0 || allGroups.every(g => {
    // Check only required groups
    if (g.required) {
      return (selectedAddons[g.groupName] || []).length > 0;
    }
    return true; // Non-required groups are always valid
  });

  return (
    <Modal 
      isOpen={open} 
      onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
      size="2xl"
      scrollBehavior="inside"
      placement="center"
      classNames={{
        wrapper: "backdrop-blur-sm py-8",
        base: "bg-white shadow-2xl rounded-2xl max-w-4xl h-[80vh] my-0",
        header: "p-0 [&>button]:!hidden",
        body: "p-0",
        footer: "p-0",
      }}
      hideCloseButton={true}
    >
      <ModalContent className="rounded-2xl">
        <>
          {/* Header with close button */}
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-2xl font-thai font-bold text-gray-800">{item.name_th}</h2>
            <Button
              isIconOnly
              variant="light"
              className="text-gray-600 hover:bg-gray-100 rounded-full"
              onPress={onClose}
            >
              ✕
            </Button>
          </div>

          <ModalBody className="p-8 pt-6 flex-1 overflow-y-auto">
            <div className="flex gap-8">
              {/* Left Side - Options */}
              <div className="flex-1">
                {item.addons?.map((group, idx) => (
                  <div key={idx} className="mb-8">
                    <h4 className="text-xl font-thai font-semibold text-gray-800 mb-4">
                      {group.groupName} :
                    </h4>

                    <div className="grid grid-cols-4 gap-4">
                      {group.options.map((opt, i) => {
                        const isSelected = selectedAddons[group.groupName]?.includes(opt.name) || false;

                        return (
                          <button
                            key={i}
                            className={`p-5 rounded-lg border-2 transition-all text-center min-h-[85px]
                              ${isSelected 
                                ? 'border-green-500 bg-green-100 text-green-800' 
                                : 'border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50'}`}
                            onClick={() => {
                              onToggleAddon(group.groupName, opt.name, !isSelected, group.max);
                            }}
                          >
                            <span className="text-lg font-thai font-medium">{opt.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {item.addons && idx < item.addons.length - 1 && <Divider className="mt-6" />}
                  </div>
                ))}
              </div>

              {/* Right Side - Price, Quantity, and Add to Cart */}
              <div className="w-64 flex flex-col justify-between">
                <div>
                  {/* Price */}
                  <div className="text-3xl font-thai font-bold text-blue-500 mb-6">
                    ฿ {totalPrice.toFixed(2)}
                  </div>
                  
                  {/* Quantity */}
                  <div className="mb-6">
                    <div className="text-sm font-thai text-gray-600 mb-2">จำนวน {quantity}</div>
                    <div className="flex bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        className="flex-1 py-3 text-gray-600 hover:bg-gray-200 transition-colors"
                        onClick={() => onChangeQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity === 1}
                      >
                        −
                      </button>
                      <div className="flex-1 py-3 bg-white text-blue-500 font-thai font-semibold text-center border-l border-r border-gray-300">
                        {quantity}
                      </div>
                      <button
                        className="flex-1 py-3 text-gray-600 hover:bg-gray-200 transition-colors"
                        onClick={() => onChangeQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  className={`w-full py-6 rounded-xl transition-colors flex items-center justify-center min-h-[60px] ${
                    canConfirm 
                      ? 'bg-sky-500 hover:bg-sky-600 text-white cursor-pointer' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={onConfirm}
                  disabled={!canConfirm}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </button>
              </div>
            </div>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}