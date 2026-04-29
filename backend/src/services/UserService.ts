import UserRepository from "../repositories/UserRepository";
import { IUser } from "../models/User";

class UserService {
  async getAllUsers(): Promise<IUser[]> {
    return UserRepository.findAll();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return UserRepository.findById(id);
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return UserRepository.create(data);
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return UserRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return UserRepository.delete(id);
  }
}

export default new UserService();
