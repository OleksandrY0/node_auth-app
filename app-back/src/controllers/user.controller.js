import { User } from '../models/user.model.js';
import { userService } from '../services/user.service.js';
import bcrypt from 'bcrypt';

const getAllActivated = async (req, res) => {
  const users = await userService.getAllActivated();

  res.send(users.map(userService.normalizedUser));
};

const changeName = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name || name.trim().length < 2) {
    throw ApiError.badRequest('Name is invalid');
  }

  const user = await userService.changeName(userId, name.trim());

  res.send({
    user: userService.normalizedUser(user),
  });
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  const user = await userService.findUserById(userId);

  const isValid = await bcrypt.compare(oldPassword, user.password);

  if (!isValid) {
    return res.sendStatus(401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const newUser = await userService.changePassword(user, hashedPassword);

  res.send({
    user: userService.normalizedUser(newUser),
  });
};

const changeEmail = async (req, res) => {
  const { password, newEmail } = req.body;
  const user = req.user;

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.sendStatus(401);
  }

  const newUser = await userService.changeEmail(user, newEmail);

  res.send({
    user: userService.normalizedUser(newUser),
  });
};

export const userController = {
  getAllActivated,
  changeName,
  changePassword,
  changeEmail,
};
