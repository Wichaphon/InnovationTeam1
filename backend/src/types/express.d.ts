// src/types/express.d.ts
import 'express-serve-static-core' // ให้แน่ใจว่าเรากำลัง augment ของ express

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;   // cuid() จาก Prisma => string
        role?: string;    // ใส่ไว้เผื่อ middleware เติมทีหลัง (ไม่ต้องมีใน JWT)
      };
    }
  }
}

// สำคัญมาก: ทำให้ไฟล์นี้เป็นโมดูล ไม่งั้น augmentation อาจไม่ทำงาน
export { };