import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user.model.js';
import { emailService } from './email.service.js';
import { ApiError } from '../exeptions/api.error.js';

async function getAllActivated() {
  const users = await User.findAll({
    where: {
      activationToken: null,
    },
  });

  return users;
}

function normalizedUser({ id, email }) {
  return { id, email };
}

async function findByEmail(email) {
  return await User.findOne({
    where: {
      email,
    },
  });
}

async function register(email, password) {
  const activationToken = uuidv4();

  const existUser = await findByEmail(email);

  if (existUser) {
    throw ApiError.badRequest('User already exist');
  }

  await User.create({ email, password, activationToken });
  await emailService.sendActivationEmail(email, activationToken);
}

export const userService = {
  register,
  getAllActivated,
  normalizedUser,
  findByEmail,
};
