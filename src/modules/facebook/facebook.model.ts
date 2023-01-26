import { prop, getModelForClass } from '@typegoose/typegoose';

export class FacebookQuestion {
  //This is how facebook calls the field When receiving the lead data "name" maps to the field name
  @prop({ type: String, required: true })
  key?: string;

  // This is the name that should be sent to dolphin leads
  @prop({ type: String, required: true })
  predefinedField: string;
}

export class FacebookSubscription {
  @prop({ type: String, required: true })
  page_id: string;

  @prop({ type: String, required: true })
  page_name: string;

  @prop({ type: String, required: true, unique: true })
  form_id: string;

  @prop({ type: String, required: true })
  form_name: string;

  @prop({ type: String, required: true })
  page_access_token: string;

  @prop({ type: String, required: true })
  companyId: string;

  @prop({ type: String, required: true })
  campaignId: string;

  @prop({ type: Array<FacebookQuestion>, required: true, _id: false })
  questions: FacebookQuestion[];
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
