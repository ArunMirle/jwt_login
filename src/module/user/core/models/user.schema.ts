import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Permission } from './userpermission.schema';
import { UserType } from '../../common/types/permission';

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
  age?: string;

  @Prop({ required: true, enum: Object.values(UserType) })
  userType: string;

  @Prop({ required: false })
  designation?: string;

  @Prop({ type: [Permission], default: [] })
  permissions: Permission[];
}

export const UserSchema = SchemaFactory.createForClass(User);

