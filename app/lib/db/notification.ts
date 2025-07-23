// app/lib/db/notification.ts

import type {Notification, Prisma} from '../../../generated/prisma/client';
import prisma from './index';

// Create a new notification
export async function createNotification(data: {
    artistId: string;
    type: 'MATCH' | 'EVENT' | 'FLAG' | 'OTHER';
    message: string;
    read?: boolean;
}): Promise<Notification> {
    return prisma.notification.create({data});
}

// Get notification by ID
export async function getNotificationById(id: string) {
    return prisma.notification.findUnique({where: {id}});
}

// Update notification
export async function updateNotification(id: string, data: Prisma.NotificationUpdateInput) {
    return prisma.notification.update({where: {id}, data});
}

// Delete notification
export async function deleteNotification(id: string) {
    return prisma.notification.delete({where: {id}});
}

// List all notifications (optionally filter)
export async function listNotifications(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput;
}) {
    return prisma.notification.findMany(params);
}
