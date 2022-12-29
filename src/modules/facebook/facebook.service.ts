import { config } from '../../utils/config';
import { FacebookModel } from './facebook.model';

export async function getUserPages({
  access_token,
  user_id,
}: {
  access_token: string;
  user_id: string;
}) {
  const url = `https://graph.facebook.com/v15.0/${user_id}/accounts?fields=name,access_token&access_token=${access_token}`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw data;
}

export async function getPageForms({
  access_token, // page acess token
  page_id,
}: {
  access_token: string;
  page_id: string;
}) {
  const url = `https://graph.facebook.com/${page_id}/leadgen_forms?access_token=${access_token}`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw data;
}

export async function subscribePageToApp({
  page_id,
  page_access_token, // page access token
}: {
  page_id: string;
  page_access_token: string;
}) {
  const url = `https://graph.facebook.com/v15.0/${page_id}/subscribed_apps?subscribed_fields=leadgen&access_token=${page_access_token}`;
  const response = await fetch(url, {
    method: 'POST',
  });
  const data = await response.json();
  if (response.ok) return data;

  throw data;
}

// Todo type out input
export async function createFacebok(input: any) {
  return FacebookModel.create(input);
}

export async function findFacebookLeadgenInfo({
  formId,
  pageId,
}: {
  formId: string;
  pageId: string;
}) {
  return FacebookModel.findOne({ formId, pageId });
}

export async function getFullLeadData(leadId: string, access_token: string) {
  const url = `https://graph.facebook.com/v15.0/${leadId}/?access_token=${access_token}`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.ok) return data;

  throw data;
}

async function getLongLivedUserAccessToken(access_token: string) {
  const url = `https://graph.facebook.com/v15.0/oauth/access_token?  
  grant_type=fb_exchange_token&          
  client_id=${config.APP_ID}&
  client_secret=${config.APP_SECRET}&
  fb_exchange_token=${access_token}`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.ok && data.access_token) {
    return data.access_token;
  }

  throw data;
}

export async function getLongLivedPageAccessToken({
  user_access_token,
  user_id,
}: {
  user_access_token: string;
  user_id: string;
}) {
  const longLivedUserToken = await getLongLivedUserAccessToken(
    user_access_token
  );
  const url = `https://graph.facebook.com/v15.0/${user_id}/accounts?
  access_token=${longLivedUserToken}`;

  const response = await fetch(url);
  const data = await response.json();

  if (response.ok) return data.data[0].access_token;

  throw data;
}
