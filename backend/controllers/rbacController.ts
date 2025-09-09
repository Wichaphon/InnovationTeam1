const { body, param, validationResult } = require('express-validator');
const rbacService = require('../services/rbacService');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

// Validators
const validateCreateRole = [body('name').isString().notEmpty()];
const validateIdParams = [param('id').isString().notEmpty()];
const validateSetUserRoleParams = [param('userId').isString().notEmpty(), param('roleId').isString().notEmpty()];
const validateGetUserRoleParams = [param('userId').isString().notEmpty()];
const validateCreateUser = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 8 }),
  body('fname').isString().notEmpty(),
  body('lname').isString().notEmpty(),
  body('roleId').isString().notEmpty(),
];

// Controllers
async function listRoles(req, res) {
  const roles = await rbacService.listRoles();
  return res.json(roles);
}

async function createRole(req, res) {
  const err = handleValidation(req, res); if (err) return;
  const role = await rbacService.createRole(req.body);
  return res.status(201).json(role);
}

async function deleteRole(req, res) {
  const err = handleValidation(req, res); if (err) return;
  const { id } = req.params;
  const role = await rbacService.deleteRole(id);
  return res.json(role);
}

async function setUserRole(req, res) {
  const err = handleValidation(req, res); if (err) return;
  const { userId, roleId } = req.params;
  const user = await rbacService.setUserRole(userId, roleId);
  return res.json(user);
}

async function getUserRole(req, res) {
  const err = handleValidation(req, res); if (err) return;
  const { userId } = req.params;
  const role = await rbacService.getUserRole(userId);
  return res.json(role);
}

async function createUser(req, res) {
  const err = handleValidation(req, res); if (err) return;
  try {
    const { email, password, fname, lname, roleId } = req.body;
    const user = await rbacService.createUserWithRole({ email, password, fname, lname, roleId });
    return res.status(201).json(user);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ message: e.message || 'Create user failed' });
  }
}

module.exports = {
  // validators
  validateCreateRole,
  validateIdParams,
  validateSetUserRoleParams,
  validateGetUserRoleParams,
  validateCreateUser,
  // controllers
  listRoles,
  createRole,
  deleteRole,
  setUserRole,
  getUserRole,
  createUser,
};
