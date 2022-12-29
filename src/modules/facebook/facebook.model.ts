import { prop, getModelForClass } from '@typegoose/typegoose';
export class Facebook {
  @prop({ type: String, required: true })
  pageId: string;

  @prop({ type: String, required: true, unique: true })
  formId: string;
}

export const FacebookModel = getModelForClass(Facebook, {
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
});
