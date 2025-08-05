// hooks/useSession.ts
import {useEffect} from 'react';
import {useUserStore} from '@/context/useUserStore';
import {UserEntity} from '@repo/shared/types';

interface UseSessionOptions {
  required?: boolean;
  onUnauthenticated?: (user: UserEntity | null | undefined) => void;
}

export function useSession(options?: UseSessionOptions) {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null && options?.required && options.onUnauthenticated) {
      options.onUnauthenticated(user);
    }
  }, [user, options]);

  return {user};
}
