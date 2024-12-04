import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { Permission } from '../permissions/permissions.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
  @InjectModel(Permission.name) private permissionModel: Model<Permission>) {}

  // Find a user by username
  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  // Find a user by ID
  async findById(userId: string): Promise<any> {
    const user = await this.userModel
      .findById(userId)
      .select('-password') 
      .populate('permissions', 'name action subject') 
      .exec();
  
    if (!user) {
      return null; 
    }
  
    return {
      user, 
    };
  }
  

  // Create a new user (registration)
  async createUser(
    username: string,
    password: string,
    email: string,
    phoneNumber?: string,
    age?: number,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const allPermissions = await this.permissionModel.find().exec();
  
    const permissionIds = allPermissions.map(permission => permission._id);
  
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      age,
      permissions: permissionIds,
    });
  
    return newUser.save(); 
  }
  

  // Validate a user's credentials during login
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; // Return the user if credentials match
    }
    return null;
  }
}
