// app/lib/permissions/context.ts

import type {Artist} from './roles';

export interface AuthContext {
    user: Artist;
    isGroupAdmin: (groupId: string) => boolean;
    isSuperAdmin: () => boolean;
    canManageEvent: (eventId: string) => boolean;
    canManageUser: (userId: string) => boolean;
}
