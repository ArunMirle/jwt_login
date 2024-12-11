import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './module/user/core/user.module';
import { PermissionModule } from './module/user/permissions/permissions.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs-auth'), // Replace with your MongoDB URL
    UsersModule,
  
    PermissionModule
  ],
})
export class AppModule {}
