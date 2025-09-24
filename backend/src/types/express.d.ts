import 'express-serve-static-core' // ให้แน่ใจว่าเรากำลัง augment ของ express

declare global {
  namespace Express {
    interface User {
      id: string;
      role?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

// สำคัญมาก: ทำให้ไฟล์นี้เป็นโมดูล ไม่งั้น augmentation อาจไม่ทำงาน
export { };