/**
 * API Endpoint: Audit Logs
 * GET /api/audit-logs - Get audit logs
 * GET /api/audit-logs/report - Generate audit report
 * GET /api/audit-logs/export - Export audit logs
 */

import { logAction } from '../lib/audit-log-service';
import * as auditLogService from '../lib/audit-log-service';

export default async function handleAuditLogs(req: any, res: any) {
  const { method, query, headers } = req;
  const userId = req.userId; // From auth middleware
  const ipAddress = headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown';

  try {
    // GET /api/audit-logs - Get audit logs
    if (method === 'GET' && !query.report && !query.export) {
      // Only admins/owners can view audit logs
      const isAdmin = false; // TODO: Check user role

      if (!isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const limit = Math.min(parseInt(query.limit) || 50, 200);
      const offset = parseInt(query.offset) || 0;
      const action = query.action;
      const resource = query.resource;
      const startDate = query.startDate ? new Date(query.startDate) : undefined;
      const endDate = query.endDate ? new Date(query.endDate) : undefined;

      let result;

      if (action) {
        result = await auditLogService.getLogsByAction(action as any, {
          limit,
          offset,
          startDate,
          endDate,
        });
      } else {
        result = await auditLogService.getUserAuditLogs(userId, {
          limit,
          offset,
          resource: resource as any,
          startDate,
          endDate,
        });
      }

      if (result.success) {
        await logAction(userId, 'READ', 'data', 'Retrieved audit logs', {
          metadata: { action, resource, limit },
          ipAddress,
        });

        return res.status(200).json({
          success: true,
          logs: result.logs,
          total: result.total,
        });
      } else {
        throw new Error(result.error);
      }
    }

    // GET /api/audit-logs/report - Generate report
    if (method === 'GET' && query.report === 'true') {
      const isAdmin = false; // TODO: Check user role

      if (!isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const startDate = query.startDate
        ? new Date(query.startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate ? new Date(query.endDate) : new Date();

      const result = await auditLogService.generateAuditReport(startDate, endDate, {
        action: query.action as any,
        resource: query.resource as any,
      });

      if (result.success) {
        await logAction(userId, 'READ', 'data', 'Generated audit report', {
          metadata: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
          ipAddress,
        });

        return res.status(200).json({
          success: true,
          report: result.report,
        });
      } else {
        throw new Error(result.error);
      }
    }

    // GET /api/audit-logs/export - Export logs
    if (method === 'GET' && query.export === 'true') {
      const isAdmin = false; // TODO: Check user role

      if (!isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const startDate = query.startDate
        ? new Date(query.startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate ? new Date(query.endDate) : new Date();
      const format = (query.format || 'csv') as 'csv' | 'json';

      const result = await auditLogService.exportAuditLogs(startDate, endDate, format);

      if (result.success) {
        await logAction(userId, 'EXPORT', 'data', 'Exported audit logs', {
          metadata: { format, startDate: startDate.toISOString(), endDate: endDate.toISOString() },
          ipAddress,
        });

        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');

        return res.status(200).send(result.data);
      } else {
        throw new Error(result.error);
      }
    }

    // GET /api/audit-logs/search - Search logs
    if (method === 'GET' && query.search) {
      const isAdmin = false; // TODO: Check user role

      if (!isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const limit = Math.min(parseInt(query.limit) || 50, 200);
      const offset = parseInt(query.offset) || 0;

      const result = await auditLogService.searchAuditLogs(query.search, {
        limit,
        offset,
        action: query.action as any,
        userId: query.userId,
      });

      if (result.success) {
        return res.status(200).json({
          success: true,
          logs: result.logs,
          total: result.total,
        });
      } else {
        throw new Error(result.error);
      }
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (error) {
    console.error('[Audit Logs API] Error:', error);

    await logAction(userId, 'API_CALL', 'data', 'Audit Logs API error', {
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
