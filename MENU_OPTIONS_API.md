# Menu Options API Documentation

## 📋 ภาพรวม

ระบบตัวเลือกเมนูประกอบด้วย 3 ตารางหลัก:

1. **option_groups** - กลุ่มตัวเลือก (เช่น "น้ำสลัด", "ระดับความสุก")
2. **options** - ตัวเลือกแต่ละอัน (เช่น "น้ำสลัดซีซาร์", "สุกปานกลาง")
3. **menu_option_groups** - ตาราง mapping ระหว่าง menu กับ option_group

---

## 🔗 API Endpoints

### 1️⃣ Option Groups (กลุ่มตัวเลือก)

#### ดึงทั้งหมด
```
GET /api/proxy/option-groups/
```

#### ดึงเดี่ยว
```
GET /api/proxy/option-groups/{id}
```

#### สร้างใหม่
```
POST /api/proxy/option-groups/
Body: {
  "name_th": "น้ำสลัด",
  "name_en": "Salad Dressing",
  "name_mm": "ဆလပ်ထမင်းအချို",
  "is_required": true
}
```

#### ลบ
```
DELETE /api/proxy/option-groups/{id}
```

---

### 2️⃣ Options (ตัวเลือกแต่ละอัน)

#### ดึงทั้งหมด
```
GET /api/proxy/options/
```

#### ดึงตาม Group
```
GET /api/proxy/options?option_group_id={id}
```

#### ดึงเดี่ยว
```
GET /api/proxy/options/{id}
```

#### สร้างใหม่
```
POST /api/proxy/options/
Body: {
  "option_group_id": 4,
  "name_th": "น้ำสลัดซีซาร์",
  "name_en": "Caesar Dressing",
  "name_mm": "ဆီဇာချဉ်ပေါင်း",
  "price": 0,
  "is_default": false
}
```

#### ลบทั้งหมด
```
DELETE /api/proxy/options/
```

---

### 3️⃣ Menu-Option Group Mappings (ตาราง mapping)

#### ดึงทั้งหมด
```
GET /api/proxy/menu-option-groups/
Response: [
  {
    "menu_id": 32,
    "option_group_id": 4,
    "created_at": "2025-09-26T10:21:13.357992",
    "updated_at": "2025-09-26T10:21:13.357997"
  }
]
```

#### ดึงตามเมนู
```
GET /api/proxy/menu-option-groups/menu/{menu_id}
```

#### ดึงตาม Option Group
```
GET /api/proxy/menu-option-groups/option-group/{option_group_id}
```

#### สร้าง Mapping ใหม่
```
POST /api/proxy/menu-option-groups/
Body: {
  "menu_id": 32,
  "option_group_id": 4
}
```

#### ลบ Mapping
```
DELETE /api/proxy/menu-option-groups/{menu_id}/{option_group_id}
```

---

### 4️⃣ Menu Option Groups (สำหรับแสดงตัวเลือกของเมนู)

#### ดึง Option Groups ของเมนูเฉพาะ
```
GET /api/proxy/menus/{menu_id}/option-groups
Response: [
  {
    "id": 4,
    "name_th": "น้ำสลัด",
    "name_en": "Salad Dressing",
    "name_mm": "ဆလပ်ထမင်းအချို",
    "is_required": true,
    "created_at": "2025-09-26T09:50:25.405158",
    "updated_at": "2025-09-26T09:50:25.405163"
  }
]
```

---

## 📊 ตัวอย่างข้อมูล

### Option Groups ที่มีอยู่

| ID | name_th | name_en | is_required |
|----|---------|---------|-------------|
| 1 | ดิปชีส | Cheese Dip | true |
| 3 | เนื้อสัตว์ | Meat | true |
| 4 | น้ำสลัด | Salad Dressing | true |
| 5 | น้ำ/แห้ง | Soup/Dry | true |
| 6 | น้ำปลาร้า | Fermented Fish Sauce | true |
| 10 | ซอส | Sauce | true |
| 12 | ไข่ | Egg | true |
| 14 | ระดับความสุกของไข่ | Egg Doneness | true |

### Mappings ที่มีอยู่

- เมนู 32 (สลัดผัก) → Option Group 4 (น้ำสลัด)
- เมนู 10 → Option Group 1 (ดิปชีส)
- เมนู 27, 29 → Option Group 6 (น้ำปลาร้า)

---

## 🧪 วิธีทดสอบ

1. เปิดหน้าทดสอบ: `http://localhost:3000/test-options`
2. เลือกเมนูที่มี options (เช่น สลัดผัก)
3. ดู option groups และ options ที่ขึ้นมา
4. ทดสอบปุ่ม API Operations เพื่อทดสอบ CRUD
5. ทดสอบปุ่ม Menu-Option Group Mappings เพื่อทดสอบการเชื่อมโยง

---

## 💡 Frontend Service Methods

### MenuOptionService

```typescript
// Option Groups
MenuOptionService.getOptionGroups()
MenuOptionService.getOptionGroupById(id)
MenuOptionService.createOptionGroup(data)
MenuOptionService.deleteOptionGroup(id)

// Options
MenuOptionService.getAllOptions()
MenuOptionService.getOptionsByGroupId(groupId)
MenuOptionService.getOptionById(id)
MenuOptionService.createOption(data)
MenuOptionService.deleteAllOptions()

// Mappings
MenuOptionService.getAllMappings()
MenuOptionService.getMappingsByMenu(menuId)
MenuOptionService.getMappingsByOptionGroup(optionGroupId)
MenuOptionService.createMapping(data)
MenuOptionService.deleteMapping(menuId, optionGroupId)

// Menu-specific
MenuOptionService.getMenuOptionGroups(menuId)
```

---

## ✅ สถานะปัจจุบัน

- ✅ เพิ่ม MENU_OPTION_GROUPS endpoint ใน API config
- ✅ เพิ่ม Types สำหรับ MenuOptionGroupMapping
- ✅ เพิ่ม Service methods ครบทั้ง 3 ตาราง
- ✅ เพิ่มปุ่มทดสอบ API ในหน้า /test-options
- ✅ แก้ไข type definition ให้ตรงกับ backend response
- ✅ ทดสอบ API เบื้องต้นสำเร็จ (มี 33 menus with options, 14 option groups)
- ✅ ลบ field `options_group` ออกจาก MenuOut type (backend ไม่มี field นี้)
- ✅ อัปเดต ProductGrid ให้ fetch mappings จาก API แทนการเช็คจากชื่อเมนู
- ✅ แก้ไข test-options page ให้ใช้ trailing slash ใน API calls

---

## 🎯 Next Steps

1. ✅ ~~ใช้ `getAllMappings()` แทน hardcoded logic ใน `ProductGrid.tsx`~~ (เสร็จแล้ว)
2. ดึง options จาก API แทน hardcoded data ใน `convertToMenuItemForModal`
3. Handle required options validation
4. ตรวจสอบว่า modal แสดงถูกต้องสำหรับเมนูที่มี options

---

## 📊 ข้อมูลจริงจากระบบ

### Menus ที่มี Option Groups (33 เมนู):
```
[10, 27, 28, 29, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 
 72, 74, 83, 85, 87, 88, 89, 90, 91, 92, 94, 95, 99, 
 113, 116, 118, 128, 129, 130]
```

ตัวอย่าง:
- เมนู 32-34: สลัดต่างๆ (น้ำสลัด)
- เมนู 27-29: เมนูที่มีน้ำปลาร้า
- เมนู 10: ฟิงเกอร์ฟู้ด (ดิปชีส)
