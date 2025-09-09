
import express from 'express'

import prisma from '../prisma.ts'

import bcrypt from 'bcrypt'


export const initialRoles = async () => {
    try {
        await prisma.role.upsert({
            
            where: {name: 'user'},
            update: {},
            create: { name: 'user' },
        });
        await prisma.role.upsert({
            where: { name: 'admin' },
            update: {},
            create: { name: 'admin' },
        });
        console.log('Roles initialized successfully');
    } catch (error) {
        console.error('Error initializing roles:', error);
    }
}

// Get all roles
export const getRoles = async (req: any, res: any) => {
  try {
    const roles = await prisma.role.findMany();
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const signUp = async (req: any, res: any) => {
  const { email, password, fname, lname, role } = req.body;
    console.log("enter signUp function")
  try {
    // check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // find role
    const userRole = await prisma.role.findUnique({ where: { name: role } })
    if (!userRole) return res.status(400).json({ message: 'Invalid role' });

    // create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fname,
        lname,
        roleId: userRole.id
      }
    });

    res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export default {signUp, initialRoles, getRoles}