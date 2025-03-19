# ใช้ Node.js image
FROM node:16 AS build

# กำหนด working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json ก่อนเพื่อให้ Docker สามารถ cache ได้
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมด
COPY . .

# รันคำสั่ง build
RUN npm run build

# ใช้ image เบาๆ สำหรับ production
FROM node:16-slim

WORKDIR /app

# คัดลอกไฟล์ build ที่สร้างเสร็จจากขั้นตอนก่อนหน้า
COPY --from=build /app/.next /app/.next
COPY --from=build /app/package*.json /app/

# ติดตั้ง dependencies สำหรับ production
RUN npm install --only=production

# กำหนดพอร์ตที่ใช้งาน
EXPOSE 3000

# รันเซิร์ฟเวอร์ในโหมด production
CMD ["npm", "start"]



# # Use the official Node.js image
# FROM node:18-alpine AS builder

# # Set working directory
# WORKDIR /app

# # Copy package files and install dependencies
# COPY package.json ./
# RUN npm install


# # Copy the entire application to the container
# COPY . .

# # Build the application
# RUN npm run build

# # Use a lightweight image for production
# FROM node:18-alpine AS runner

# # Set working directory
# WORKDIR /app

# # Copy build files from the builder stage
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/node_modules ./node_modules

# # Expose the port the app runs on
# EXPOSE 3000

# # Start the application
# CMD ["npm", "run", "start"]
