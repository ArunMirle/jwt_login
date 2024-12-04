import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { PermissionModule } from './permissions/permissions.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs-auth'), // Replace with your MongoDB URL
    UsersModule,
    AuthModule,
    PermissionModule
  ],
})
export class AppModule {}
