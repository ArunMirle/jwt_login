// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.schema';
import { PermissionModule } from '../permissions/permissions.module';
import { UsersService } from './service/user.service';
import { UsersController } from './controllers/user.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SanitizeUserInterceptor } from '../common/interceptors/hidePass.interceptor';
 // Import the UsersController


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  PermissionModule],
  providers: [UsersService,{
    provide: APP_INTERCEPTOR,
    useClass: SanitizeUserInterceptor,
  }],
  controllers: [UsersController], // Add the controller here
  exports: [UsersService],
})
export class UsersModule {}
