import { Controller, Post, Body, Get } from '@nestjs/common';
import { PermissionService } from './permissions.service';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // Route to manually add a permission
  @Post('add')
  async addPermission(
    @Body() body: { name: string; action: string; subject: string },
  ) {
    const { name, action, subject } = body;
    const permission = await this.permissionService.createPermission(
      name,
      action,
      subject,
    );
    return { message: 'Permission added successfully', permission };
  }

  // Route to get all permissions
  @Get('list')
  async listPermissions() {
    const permissions = await this.permissionService.getAllPermissions();
    return { permissions };
  }
}
