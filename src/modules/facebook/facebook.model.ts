import { prop, getModelForClass } from '@typegoose/typegoose';

export class FacebookSubscription {
  @prop({ type: String, required: true })
  page_id: string;

  @prop({ type: String, required: true })
  page_name: string;

  @prop({ type: String, required: true, unique: true })
  form_id: string;

  @prop({ type: String, required: true, unique: true })
  form_name: string;

  @prop({ type: String, required: true })
  page_access_token: string;
}

export const FacebookSubscriptionModel = getModelForClass(
  FacebookSubscription,
  {
    schemaOptions: {
      timestamps: true,
      versionKey: false,
    },
  }
);

export class FieldData {
  @prop({ type: String })
  name?: string;

  @prop({ type: [String] })
  values?: string[];
}

export class FacebookLead {
  @prop({ type: String, required: true })
  lead_id: string;

  @prop({ type: String })
  ad_id?: string;

  @prop({ type: String, required: true })
  form_id: string;

  @prop({ type: Array<FieldData>, required: false, _id: false })
  data?: FieldData[];
}

export const FacebookLeadModel = getModelForClass(FacebookLead, {
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
});
