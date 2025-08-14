# ใช้ Node.js เวอร์ชัน 18 เป็น base image
FROM node:lts-alpine

# ตั้งโฟลเดอร์ทำงานใน container
WORKDIR /app

# copy package.json และ package-lock.json (ถ้ามี)
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# copy โค้ดทั้งหมดเข้า container
COPY . .

# บอกว่า container ใช้ port 5000
EXPOSE 5000

# คำสั่งเริ่มรันแอป
CMD ["npm", "run", "dev"]
