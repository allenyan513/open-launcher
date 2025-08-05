// stores/useUserStore.ts
import { create } from 'zustand';
import { UserEntity } from '@repo/shared/types';
import { api } from '@repo/shared/api-client';
import { redirect } from 'next/navigation';

type UserState = {
  user: UserEntity | null | undefined;
  setUser: (user: UserEntity | null | undefined) => void;
  syncSession: () => Promise<void>;
  signIn: (callbackUrl?: string) => void;
  signOut: () => void;
  googleSignIn: (redirectUrl?: string) => void;
  githubSignIn: (redirectUrl?: string) => void;
  twitterSignIn: (redirectUrl?: string) => void;
  sendMagicLink: (email: string, redirectUrl?: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: undefined,

  setUser: (user) => set({ user }),

  syncSession: async () => {
    try {
      const user = await api.auth.getSession();
      set({ user });
    } catch {
      set({ user: null });
    }
  },

  signIn: (redirectUrl?: string) => {
    const user = get().user;
    if (!user) {
      const defaultCallbackUrl =
        typeof window !== 'undefined'
          ? window.location.href
          : redirectUrl || '/';
      redirect('/auth/signin?redirect=' + encodeURIComponent(defaultCallbackUrl));
    }
  },

  signOut: () => {
    set({ user: null });
    redirect(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/auth/signOut`);
  },

  googleSignIn: (redirectUrl?: string) => {
    redirect(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/auth/google?redirect=${encodeURIComponent(redirectUrl || '')}`
    );
  },

  githubSignIn: (redirectUrl?: string) => {
    redirect(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/auth/github?redirect=${encodeURIComponent(redirectUrl || '')}`
    );
  },

  twitterSignIn: (redirectUrl?: string) => {
    redirect(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/auth/twitter?redirect=${encodeURIComponent(redirectUrl || '')}`
    );
  },

  sendMagicLink: async (email: string, redirectUrl?: string) => {
    await api.auth.sendMagicLink(email, redirectUrl);
  },

  deleteAccount: async () => {
    const user = get().user;
    if (!user) {
      console.error('No user to delete');
      return;
    }
    try {
      await api.user.deleteAccount();
      set({ user: null });
      redirect('/auth/signin');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  },
}));
