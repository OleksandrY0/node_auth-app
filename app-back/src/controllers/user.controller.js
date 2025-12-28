import { User } from "../models/user.model.js";
import { userService } from "../services/user.service.js";

const getAllActivated = async (req, res) => {
  const users = await userService.getAllActivated();

  res.send(users.map(userService.normalizedUser));
}

export const userController = {
  getAllActivated,
};
