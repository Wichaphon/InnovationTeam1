const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
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
} = require('../controllers/rbacController');

// Roles
router.get('/roles', authenticate, requireRole('Admin'), listRoles);
router.post('/roles', authenticate, requireRole('Admin'), validateCreateRole, createRole);
router.delete('/roles/:id', authenticate, requireRole('Admin'), validateIdParams, deleteRole);

// User Role (single role per user)
router.get('/users/:userId/role', authenticate, requireRole('Admin'), validateGetUserRoleParams, getUserRole);
router.post('/users/:userId/roles/:roleId', authenticate, requireRole('Admin'), validateSetUserRoleParams, setUserRole);

// Admin create user with role
router.post('/users', authenticate, requireRole('Admin'), validateCreateUser, createUser);

module.exports = router;
