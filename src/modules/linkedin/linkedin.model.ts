import { prop, getModelForClass } from '@typegoose/typegoose';

export class LinkedinSubscription {
  @prop({ type: String, required: true })
  access_token: string;

  @prop({ type: String, required: true })
  formUrn: string;

  @prop({ type: String, required: true })
  accountUrn: string;
}

export const LinkedinSubscriptionModel = getModelForClass(
  LinkedinSubscription,
  {
    schemaOptions: {
      timestamps: true,
      versionKey: false,
    },
  }
);
