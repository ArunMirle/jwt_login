import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.schema';

import { Action, Subject } from '../../common/types/permission';
import { JwtUtility } from '../../common/utility/jwt';



@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
 
  )
   {}

  // Find a user by username
  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  // Find a user by ID
  async findById(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return null;
    }
  
    return user.toObject(); 
    
  }
  
  async createUser(
    username: string,
    password: string,
    email: string,
    userType: string,
    phoneNumber?: string,
    age?: number,
    designation?: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const defaultPermissions =
      userType === 'Admin'
        ? [
            { action: Action.CREATE, subject: Subject.USER },
            { action: Action.READ, subject: Subject.USER },
            { action: Action.UPDATE, subject: Subject.USER },
            { action: Action.DELETE, subject: Subject.USER },
          ]
        : [
            { action: Action.READ, subject: Subject.USER },
            { action: Action.CREATE, subject: Subject.USER },
          ];
  
    const newUser = await this.userModel.create({
      username,
      password: hashedPassword,
      email,
      userType,
      phoneNumber,
      age,
      designation,
      permissions: defaultPermissions,
    });
  
    return newUser;
  }

  
 

  

  
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; 
    }
    return null;
  }
 
 
  async login(user: any) {
    const payload = { username: user.username, userId: user._id }; 
    return {
      accessToken: JwtUtility.generateJwt(payload)
    };
  }
}
