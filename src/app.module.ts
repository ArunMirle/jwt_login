import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PermissionModule } from './permissions/permissions.module';

import { UsersModule } from './Models/user/user.module';
import { AuthModule } from './Models/user/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs-auth'), // Replace with your MongoDB URL
    UsersModule,
    AuthModule,
    PermissionModule
  ],
})
export class AppModule {}
