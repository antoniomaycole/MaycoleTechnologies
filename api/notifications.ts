/**
 * API Endpoint: Notifications
 * GET /api/notifications - Get user notifications
 * POST /api/notifications - Create notification
 * PUT /api/notifications/:id/read - Mark as read
 * PUT /api/notifications/read-all - Mark all as read
 * DELETE /api/notifications/:id - Delete notification
 * GET /api/notifications/preferences - Get preferences
 * PUT /api/notifications/preferences - Update preferences
 */

import { logAction } from '../lib/audit-log-service';
import * as notificationService from '../lib/notification-service';

export default async function handleNotifications(req: any, res: any) {
  const { method, query, body, headers } = req;
  const userId = req.userId; // From auth middleware
  const ipAddress = headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown';

  try {
    // GET /api/notifications - Get user notifications
    if (method === 'GET' && !query.id && !query.preferences) {
      const limit = Math.min(parseInt(query.limit) || 50, 200);
      const offset = parseInt(query.offset) || 0;
      const unreadOnly = query.unreadOnly === 'true';

      const result = await notificationService.getNotifications(userId, {
        limit,
        offset,
        unreadOnly,
      });

      if (result.success) {
        await logAction(userId, 'READ', 'data', 'Retrieved notifications', {
          metadata: { unreadOnly, limit },
          ipAddress,
        });

        return res.status(200).json({
          success: true,
          notifications: result.notifications,
          total: result.total,
        });
      } else {
        throw new Error(result.error);
      }
    }

    // POST /api/notifications - Create notification
    if (method === 'POST' && !query.id) {
      const { type, title, message, actionUrl, actionLabel, expiresAt, metadata } = body;

      if (!type || !title || !message) {
        return res.status(400).json({ error: 'Missing required fields: type, title, message' });
      }

      const result = await notificationService.createNotification(userId, type, title, message, {
        actionUrl,
        actionLabel,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        metadata,
      });

      if (result.success) {
        await logAction(userId, 'CREATE', 'data', `Created notification: ${title}`, {
          resourceId: result.notificationId,
          metadata: { type },
          ipAddress,
        });

        return res.status(201).json({
          success: true,
          notificationId: result.notificationId,
        });
      } else {
        throw new Error(result.error);
      }
    }

    // PUT /api/notifications/:id/read - Mark as read
    if (method === 'PUT' && query.id && query.action === 'read') {
      const result = await notificationService.markAsRead(query.id, userId);

      if (result.success) {
        await logAction(userId, 'UPDATE', 'data', 'Marked notification as read', {
          resourceId: query.id,
          ipAddress,
        });

        return res.status(200).json({ success: true });
      } else {
        throw new Error(result.error);
      }
    }

    // PUT /api/notifications/read-all - Mark all as read
    if (method === 'PUT' && query.action === 'read-all') {
      const result = await notificationService.markAllAsRead(userId);

      if (result.success) {
        await logAction(userId, 'UPDATE', 'data', `Marked ${result.count} notifications as read`, {
          metadata: { count: result.count },
          ipAddress,
        });

        return res.status(200).json({ success: true, count: result.count });
      } else {
        throw new Error(result.error);
      }
    }

    // DELETE /api/notifications/:id - Archive notification
    if (method === 'DELETE' && query.id) {
      const result = await notificationService.archiveNotification(query.id, userId);

      if (result.success) {
        await logAction(userId, 'DELETE', 'data', 'Archived notification', {
          resourceId: query.id,
          ipAddress,
        });

        return res.status(200).json({ success: true });
      } else {
        throw new Error(result.error);
      }
    }

    // GET /api/notifications/preferences - Get preferences
    if (method === 'GET' && query.preferences === 'true') {
      const result = await notificationService.getNotificationPreferences(userId);

      if (result.success) {
        await logAction(userId, 'READ', 'settings', 'Retrieved notification preferences', {
          ipAddress,
        });

        return res.status(200).json({
          success: true,
          preferences: result.preferences,
        });
      } else {
        throw new Error(result.error);
      }
    }

    // PUT /api/notifications/preferences - Update preferences
    if (method === 'PUT' && query.preferences === 'true') {
      const result = await notificationService.updateNotificationPreferences(userId, body);

      if (result.success) {
        await logAction(userId, 'UPDATE', 'settings', 'Updated notification preferences', {
          changes: { before: {}, after: body },
          ipAddress,
        });

        return res.status(200).json({ success: true });
      } else {
        throw new Error(result.error);
      }
    }

    // GET /api/notifications/stats - Get notification stats
    if (method === 'GET' && query.stats === 'true') {
      const result = await notificationService.getNotificationStats(userId);

      if (result.success) {
        return res.status(200).json({
          success: true,
          stats: result.stats,
        });
      } else {
        throw new Error(result.error);
      }
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (error) {
    console.error('[Notifications API] Error:', error);

    await logAction(userId, 'API_CALL', 'data', 'Notifications API error', {
      status: 'failure',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      ipAddress,
    });

    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
