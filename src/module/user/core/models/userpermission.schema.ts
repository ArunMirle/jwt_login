import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Action, Subject } from '../../common/types/permission';


@Schema()
export class Permission extends Document {
  
  @Prop({ required: true, enum: Action })
  action: Action;

  @Prop({ required: true, enum: Subject })
  subject: Subject;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
