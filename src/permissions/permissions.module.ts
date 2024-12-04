import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './permissions.schema';
import { PermissionService } from './permissions.service';
import { PermissionController } from './permissions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports:[MongooseModule]
})
export class PermissionModule {}
