import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; // Adjust the import path accordingly
import { SchemaTypes } from 'mongoose';  // Correct import
import { UserPermission } from './userpermission.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  phoneNumber?: string;

  @Prop({ required: false })
  age?: number;
  @Prop({ type: [UserPermission], default: [] })
  permissions: UserPermission[];
}

export const UserSchema = SchemaFactory.createForClass(User);
