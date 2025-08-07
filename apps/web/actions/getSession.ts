'use server';

import {generateAuthFetchOptions} from "@/utils";
import {api, UserEntity} from "@repo/shared";


export default async function getSession(): Promise<UserEntity | null> {
  try {
    const options = await generateAuthFetchOptions()
    return await api.user.getUserProfile(options);
  } catch (error) {
    return null;
  }
}


