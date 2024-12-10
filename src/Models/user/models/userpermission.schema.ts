import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Action, Subject } from '../common/enum';
; // Adjust path as needed

@Schema()
export class UserPermission extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, enum: Action })
  action: Action;

  @Prop({ required: true, enum: Subject })
  subject: Subject;
}

export const UserPermissionSchema = SchemaFactory.createForClass(UserPermission);
