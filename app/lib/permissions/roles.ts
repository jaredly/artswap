// app/lib/permissions/roles.ts

export type Role = 'super-admin' | 'group-admin' | 'member';

export enum Roles {
    SUPER_ADMIN = 'super-admin',
    GROUP_ADMIN = 'group-admin',
    MEMBER = 'member',
}

// Permission matrix actions
export enum PermissionAction {
    VIEW_OWN_ARTWORKS = 'viewOwnArtworks',
    SUBMIT_TO_EVENTS = 'submitToEvents',
    VOTE_IN_EVENTS = 'voteInEvents',
    CREATE_GROUPS = 'createGroups',
    MANAGE_GROUP_EVENTS = 'manageGroupEvents',
    INVITE_TO_GROUPS = 'inviteToGroups',
    FLAG_CONTENT = 'flagContent',
    REMOVE_USERS = 'removeUsers',
    CHANGE_EVENT_PHASES = 'changeEventPhases',
    VIEW_AUDIT_LOGS = 'viewAuditLogs',
    MANAGE_ANY_GROUP = 'manageAnyGroup',
    DELETE_ANY_CONTENT = 'deleteAnyContent',
}

export interface Artist {
    id: string;
    name: string;
    email: string;
    role: Role;
    groups: Array<{id: string; role: Role}>;
}

export function isSuperAdmin(user: Artist): boolean {
    return user.role === Roles.SUPER_ADMIN;
}

export function isGroupAdmin(user: Artist, groupId: string): boolean {
    return user.role === Roles.SUPER_ADMIN || user.groups.some((g) => g.id === groupId && g.role === Roles.GROUP_ADMIN);
}

export function isMember(user: Artist, groupId: string): boolean {
    return user.role === Roles.SUPER_ADMIN || user.groups.some((g) => g.id === groupId);
}

// Example permission check
export function canManageEvent(user: Artist, groupId: string): boolean {
    return isGroupAdmin(user, groupId) || isSuperAdmin(user);
}

export function canInviteToGroup(user: Artist, groupId: string): boolean {
    return isGroupAdmin(user, groupId) || isSuperAdmin(user);
}

export function canRemoveUser(user: Artist, groupId: string): boolean {
    return isGroupAdmin(user, groupId) || isSuperAdmin(user);
}

export function canChangeEventPhase(user: Artist, groupId: string): boolean {
    return isGroupAdmin(user, groupId) || isSuperAdmin(user);
}
