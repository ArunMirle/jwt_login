import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './module/user/core/user.module';
import { PermissionModule } from './module/user/permissions/permissions.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs-auth'), 
    UsersModule,
  
    PermissionModule
  ],
})
export class AppModule {}
