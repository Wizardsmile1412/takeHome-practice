# Voting app

## Voting System (Frontend + Backend)

### โจทย์

คุณจะได้พัฒนาระบบ **Quote Voting** ที่ผู้ใช้สามารถเข้าสู่ระบบ, ดูรายการคำพูด (Quotes), โหวต, ค้นหา, และดูผลลัพธ์ในรูปแบบกราฟ พร้อมฟังก์ชันจัดการข้อมูลเบื้องหลัง เช่น เพิ่ม/แก้ไข Quote และการโหวตแบบ 1 คนต่อ 1 ครั้ง

Functional Requirements

### Authentication

- ผู้ใช้สามารถ **Login** ด้วย Username/Password
- หลังจาก Login แล้ว จะได้รับ Token (`Bearer Token`) ใช้สำหรับเข้าถึง API ต่างๆ
- Logout เมื่อหมด Session

---

### Quote List Page (Frontend)

- แสดงรายการ Quotes ทั้งหมดจาก API
- Additional function like lazy loading, search  & filter vote item, visualize chart, sorting
- Quote หนึ่งแสดง:
    - ข้อความ
    - จำนวนคะแนนปัจจุบัน
    - ปุ่ม Vote
- ผู้ใช้สามารถโหวตได้เพียง 1 ครั้งต่อ Quote
- หลังโหวต คะแนนจะอัปเดตทันที (Optimistic UI)

---

### Advanced Features

- ค้นหา Quote ด้วยคำค้น (search by keyword)
- Filter Quotes ตามคะแนน (เช่น มากกว่า 10 คะแนน)
- จัดเรียง (Sort) ตามคะแนนหรือตัวอักษร
- Visualize vote result ด้วย Chart (Bar chart หรือ Pie chart)
- (Optional): ปรับ UI/UX ให้สวยงามและ Responsive

---

## ⚙️ Backend API Features

### Authentication API

- `POST /login`: รับ `username` และ `password` คืนค่า `accessToken`
- Token ต้องแนบแบบ `Authorization: Bearer <token>` สำหรับทุก endpoint ที่เหลือ

---

### Quotes API

- `GET /quotes`: คืนรายการ Quotes ทั้งหมด
    - รองรับ query param:
        - `?search=...`
        - `?filter=minVotes=...`
        - `?sort=asc|desc`
- `GET /quotes/:id`: คืนข้อมูล Quote พร้อมคะแนน และรายละเอียด Vote
- `POST /quotes`: เพิ่ม Quote ใหม่ (เฉพาะ quote ที่คะแนน = 0 เท่านั้น)
- `PUT /quotes/:id`: แก้ไขข้อความ Quote (เฉพาะ quote ที่คะแนน = 0 เท่านั้น)
- `POST /quotes/:id/vote`: โหวต quote นั้น
    - ตรวจสอบว่า user เคยโหวตแล้วหรือยัง (1 คนโหวตได้ 1 ครั้งต่อ quote)
    - เพิ่มคะแนน quote หากยังไม่เคยโหวต

---

## ✅ Acceptance Criteria

- ระบบ Login ทำงานสมบูรณ์ มีการจัดการ Token อย่างปลอดภัย
- แสดงรายชื่อ Quotes ด้วย React Window สำหรับการแสดงผลแบบ Virtualized list
- การค้นหา, filter, sort สามารถใช้งานได้
- ผู้ใช้โหวตได้ 1 ครั้งต่อ quote และผลโหวตอัปเดตทันที
- สามารถเพิ่ม/แก้ไข quote เฉพาะ quote ที่คะแนนยังเป็น 0
- แสดงผล vote เป็นกราฟ
- API มีการ validate token ทุก endpoint ที่จำเป็น
- โค้ดมีการจัดโครงสร้างดี, อ่านง่าย, พร้อมคำอธิบายใน README

---

## 💡 Tech Stack (แนะนำ)

- **Frontend:** React, Chart.js / Recharts, Axios
- **Backend:** Node.js + Express (หรือใช้ NestJS ก็ได้), JWT, In-memory DB หรือ SQLite
- **Auth:** JWT-based authentication

---

## 📁 Submission

- ส่งลิงก์ GitHub repository ที่มี source code และไฟล์ README:
    - วิธีติดตั้งและรันทั้ง Frontend และ Backend
    - คำอธิบาย Design decision ที่เลือกใช้

---

## ⏳ Bonus (Optional)

- มีระบบ Register
- รองรับ theme (dark / light)
- มี Unit test หรือ Integration test

[🏗️ Architecture & Learning Plan](https://www.notion.so/Architecture-Learning-Plan-32861774cf38811abaa6d553cbc17a9b?pvs=21)