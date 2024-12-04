import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Permission extends Document {
  @Prop({ required: true })
  name: string; // A descriptive name for the permission

  @Prop({ required: true })
  action: string; // The action, e.g., 'create', 'read', 'update', 'delete'

  @Prop({ required: true })
  subject: string; // The resource the action is related to, e.g., 'User', 'Post'
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
