# # ใช้ Node.js image
# FROM node:16 AS build

# # กำหนด working directory
# WORKDIR /app

# # คัดลอก package.json และ package-lock.json ก่อนเพื่อให้ Docker สามารถ cache ได้
# COPY package*.json ./

# # ติดตั้ง dependencies
# RUN npm install

# # คัดลอกไฟล์ทั้งหมด
# COPY . .

# # รันคำสั่ง build
# RUN npm run build

# # ใช้ image เบาๆ สำหรับ production
# FROM node:16-slim

# WORKDIR /app

# # คัดลอกไฟล์ build ที่สร้างเสร็จจากขั้นตอนก่อนหน้า
# COPY --from=build /app/.next /app/.next
# COPY --from=build /app/package*.json /app/

# # ติดตั้ง dependencies สำหรับ production
# RUN npm install --only=production

# # กำหนดพอร์ตที่ใช้งาน
# EXPOSE 3000

# # รันเซิร์ฟเวอร์ในโหมด production
# CMD ["npm", "start"]




# สร้างจาก image Node.js สำหรับ build
FROM node:18-alpine AS builder

# กำหนด working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json ก่อนเพื่อให้ Docker cache การติดตั้ง dependencies
COPY package.json ./ 
RUN npm install

# คัดลอกไฟล์แอปพลิเคชันทั้งหมด
COPY . .

# รันคำสั่ง build
RUN npm run build || (tail -n 50 /app/.next/error.log && exit 1)

# ใช้ image เบาๆ สำหรับ production
FROM node:18-alpine AS runner

# กำหนด working directory
WORKDIR /app

# คัดลอกไฟล์ build จากขั้นตอนก่อนหน้า
COPY --from=builder /app/package.json ./ 
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# เปิดพอร์ตที่ใช้
EXPOSE 3000

# เริ่มต้นแอป
CMD ["npm", "run", "start"]
