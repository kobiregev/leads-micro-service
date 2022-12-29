export async function getFullLeadData(leadId: string) {}

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
