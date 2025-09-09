import express from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import {
  validateCreateRole,
  validateIdParams,
  validateSetUserRoleParams,
  validateGetUserRoleParams,
  validateCreateUser,
  listRoles,
  createRole,
  deleteRole,
  setUserRole,
  getUserRole,
  createUser,
} from '../controllers/rbacController';
const router = express.Router();

// Roles
router.get('/roles', authenticate, requireRole('Admin'), listRoles);
router.post('/roles', authenticate, requireRole('Admin'), validateCreateRole, createRole);
router.delete('/roles/:id', authenticate, requireRole('Admin'), validateIdParams, deleteRole);

// User Role (single role per user)
router.get('/users/:userId/role', authenticate, requireRole('Admin'), validateGetUserRoleParams, getUserRole);
router.post('/users/:userId/roles/:roleId', authenticate, requireRole('Admin'), validateSetUserRoleParams, setUserRole);

// Admin create user with role
router.post('/users', authenticate, requireRole('Admin'), validateCreateUser, createUser);

export default router;
