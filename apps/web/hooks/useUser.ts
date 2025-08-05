// hooks/useUser.ts
import { useUserStore } from '@/context/useUserStore';

export function useUser() {
  return useUserStore((state) => ({
    user: state.user,
    signIn: state.signIn,
    signOut: state.signOut,
    googleSignIn: state.googleSignIn,
    githubSignIn: state.githubSignIn,
    twitterSignIn: state.twitterSignIn,
    sendMagicLink: state.sendMagicLink,
    deleteAccount: state.deleteAccount,
    syncSession: state.syncSession,
  }));
}
