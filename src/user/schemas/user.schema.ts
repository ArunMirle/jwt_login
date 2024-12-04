import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Permission } from 'src/permissions/permissions.schema'; // Adjust the import path accordingly
import { SchemaTypes } from 'mongoose';  // Correct import

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

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Permission' }] })
  permissions: Permission[]; 
}

export const UserSchema = SchemaFactory.createForClass(User);
