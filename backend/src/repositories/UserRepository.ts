import { User, IUser } from "../models/User";

class UserRepository {
  async findAll(): Promise<IUser[]> {
    return User.find();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  }
}

export default new UserRepository();
