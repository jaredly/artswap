// app/lib/permissions/guards.ts

import type {Artist} from './roles';
import {canChangeEventPhase, canInviteToGroup, canManageEvent, canRemoveUser, isGroupAdmin, isSuperAdmin} from './roles';

// Custom error for unauthorized access
export class AuthorizationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthorizationError';
    }
}

// Guard: require super-admin
export function requireSuperAdmin(user: Artist): void {
    if (!isSuperAdmin(user)) {
        throw new AuthorizationError('Super-admin privileges required.');
    }
}

// Guard: require group admin
export function requireGroupAdmin(user: Artist, groupId: string): void {
    if (!isGroupAdmin(user, groupId)) {
        throw new AuthorizationError('Group admin privileges required.');
    }
}

// Guard: require event management permission
export function requireManageEvent(user: Artist, groupId: string): void {
    if (!canManageEvent(user, groupId)) {
        throw new AuthorizationError('Event management permission required.');
    }
}

// Guard: require invite permission
export function requireInviteToGroup(user: Artist, groupId: string): void {
    if (!canInviteToGroup(user, groupId)) {
        throw new AuthorizationError('Invite permission required.');
    }
}

// Guard: require remove user permission
export function requireRemoveUser(user: Artist, groupId: string): void {
    if (!canRemoveUser(user, groupId)) {
        throw new AuthorizationError('Remove user permission required.');
    }
}

// Guard: require event phase change permission
export function requireChangeEventPhase(user: Artist, groupId: string): void {
    if (!canChangeEventPhase(user, groupId)) {
        throw new AuthorizationError('Event phase change permission required.');
    }
}
