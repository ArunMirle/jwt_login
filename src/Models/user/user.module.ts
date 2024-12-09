// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
 // Import the UsersController
import { PermissionModule } from 'src/permissions/permissions.module';
import { User, UserSchema } from './models/user.schema';
import { UsersService } from './service/user.service';
import { UsersController } from './controllers/user.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  PermissionModule],
  providers: [UsersService],
  controllers: [UsersController], // Add the controller here
  exports: [UsersService],
})
export class UsersModule {}
