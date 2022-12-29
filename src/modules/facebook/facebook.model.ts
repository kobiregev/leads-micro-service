import { prop, getModelForClass } from '@typegoose/typegoose';
export class Facebook {
  @prop({ type: String, required: true })
  pageId: string;

  @prop({ type: String, required: true, unique: true })
  formId: string;

  @prop({ type: String, required: true })
  page_access_token: string;
}

export const FacebookModel = getModelForClass(Facebook, {
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
});
