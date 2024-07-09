# ### Gateway - Build Stage
# FROM node:20-alpine as build

# WORKDIR /app

# # Copy package.json และ package-lock.json
# COPY package*.json ./

# # ติดตั้ง dependencies ทั้งหมด (รวมถึง dev dependencies)
# RUN npm install --force

# # คัดลอกโปรเจกต์ทั้งหมด
# COPY . ./

# # สร้างโปรเจกต์
# RUN npm run build

# ### Gateway - Production Stage
# FROM node:20-alpine

# WORKDIR /app

# # คัดลอก package.json และ package-lock.json จาก build stage
# COPY --from=build /app/package*.json ./

# # ติดตั้ง dependencies สำหรับ production
# RUN npm install --only=production --force

# # คัดลอกไฟล์ที่สร้างจาก build stage
# COPY --from=build /app/dist ./dist

# # คำสั่งเริ่มต้นแอปพลิเคชัน
# CMD ["node", "dist/apps/gateway/src/main.js"]


# ใช้ Node.js ล่าสุดเป็นฐาน
FROM node:latest

# ตั้งค่าโฟลเดอร์ทำงาน
WORKDIR /app

# คัดลอก package.json และ package-lock.json (หรือ yarn.lock) เข้ามาใน container
COPY package*.json ./

# ติดตั้ง dependencies โดยใช้ npm (หรือ yarn)
RUN npm install

# คัดลอกโค้ดทั้งหมดไปยัง container
COPY . .

# สร้าง production build
RUN npm run build

# เปิดพอร์ตที่ใช้งาน
EXPOSE 3000

# เริ่มแอปพลิเคชัน NestJS
# CMD ["node", "dist/main"]
CMD ["node", "dist/apps/gateway/src/main.js"]