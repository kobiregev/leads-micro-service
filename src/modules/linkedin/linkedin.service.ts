import { config } from '../../utils/config';
import {
  LinkedinSubscription,
  LinkedinSubscriptionModel,
} from './linkedin.model';

function linkedinDefaultHeaders(access_token: string) {
  return {
    Authorization: `Bearer ${access_token}`,
    'LinkedIn-Version': '202210',
  };
}

export async function getAuthToken(access_code: string) {
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: access_code,
      redirect_uri: config.LINKEDIN_REDIRECT_URI,
      client_id: config.LINKEDIN_CLIENT_ID,
      client_secret: config.LINKEDIN_CLIENT_SECRET,
    });
    const url = `https://www.linkedin.com/oauth/v2/accessToken`;
    const response = await fetch(url, {
      method: 'POST',
      body,
    });

    if (!response.ok) {
      throw await response.text;
    }
    const data = await response.json();
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function getUserAdAccounts(access_token: string) {
  try {
    const url = `https://api.linkedin.com/rest/adAccountUsers?q=authenticatedUser&projection=(paging,elements*(account~(name,id),role,user,changeAuditStamps))`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'LinkedIn-Version': '202210',
      },
    });

    if (!response.ok) throw await response.text();
    const data = await response.json();
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export async function getAdAccountOrganization(
  access_token: string,
  account_id: string
) {
  try {
    const url = `https://api.linkedin.com/rest/adAccounts/${account_id}?projection=(reference)`;
    const response = await fetch(url, {
      headers: linkedinDefaultHeaders(access_token),
    });

    if (!response.ok) throw await response.text();

    const data = await response.json();
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export type getOrganizationElement = {
  role: string;
  organization: string;
  roleAssignee: string;
  state: string;
};

export async function getOrganizationAcls(access_token: string) {
  try {
    const url = 'https://api.linkedin.com/rest/organizationAcls?q=roleAssignee';
    const response = await fetch(url, {
      headers: linkedinDefaultHeaders(access_token),
    });

    if (!response.ok) throw await response.text();

    const data = await response.json();
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export async function retrieveLeadSyncForms({
  access_token,
  adAccount,
}: {
  access_token: string;
  adAccount: string;
}) {
  try {
    const url = `https://api.linkedin.com/rest/adForms?q=account&account=${adAccount}`;
    const response = await fetch(url, {
      headers: linkedinDefaultHeaders(access_token),
    });

    if (!response.ok) throw await response.text();

    const data = await response.json();
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

type createLeadNotificationURLParams = {
  access_token: string;
  sponsoredEntity: string;
};
export async function createLeadNotificationURL({
  access_token,
  sponsoredEntity,
}: createLeadNotificationURLParams) {
  try {
    console.log({ access_token, sponsoredEntity });

    const url = `https://api.linkedin.com/rest/leadNotificationUrls`;
    const body = JSON.stringify({
      key: {
        developerApplication: `urn:li:developerApplication:${config.LINKEDIN_CLIENT_ID}`,
        sponsoredEntity,
      },
      status: 'ACTIVE',
      url: 'https://886e-2a0d-6fc0-84f0-1a00-f6-5eb5-2b5d-ba6b.jp.ngrok.io/api/linkedin/webhook',
    });

    console.log(url);
    console.log(body);

    const response = await fetch(url, {
      method: 'POST',
      headers: linkedinDefaultHeaders(access_token),
      body,
    });

    if (!response.ok) throw await response.text();

    const data = await response.json();
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export async function createLinkedinSubscription(input: LinkedinSubscription) {
  return LinkedinSubscriptionModel.create(input);
}
