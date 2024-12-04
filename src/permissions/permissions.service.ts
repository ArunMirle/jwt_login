import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from '../permissions/permissions.schema';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  // Add a new permission
  async createPermission(
    name: string,
    action: string,
    subject: string,
  ): Promise<Permission> {
    const newPermission = new this.permissionModel({ name, action, subject });
    return newPermission.save();
  }

  // Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionModel.find().exec();
  }

  // Find a specific permission
  async findPermissionByActionAndSubject(
    action: string,
    subject: string,
  ): Promise<Permission | null> {
    return this.permissionModel.findOne({ action, subject }).exec();
  }
}
