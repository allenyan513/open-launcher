'use server';

import {api, AuthFetchOptions, UserEntity} from "@repo/shared";
import {cookies} from "next/headers";


export async function generateAuthFetchOptions(): Promise<AuthFetchOptions> {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token')?.value;
  return {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  } as AuthFetchOptions;
}


export default async function getSession(): Promise<UserEntity | null> {
  try {
    const options = await generateAuthFetchOptions()
    return await api.user.getUserProfile(options);
  } catch (error) {
    return null;
  }
}


