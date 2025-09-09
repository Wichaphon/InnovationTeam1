// const jwt = require("jsonwebtoken");


const logger = (req: any, res: any, next: any) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};


export default logger