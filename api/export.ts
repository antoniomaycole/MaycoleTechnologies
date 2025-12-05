/**
 * Export Endpoint
 * Export user data in various formats (CSV, JSON, PDF)
 *
 * GET /api/export?format=csv&type=inventory
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db/client';
import { extractToken, verifyToken } from '@/lib/auth-utils';

type ExportFormat = 'csv' | 'json' | 'pdf';
type ExportType = 'inventory' | 'analytics' | 'payments' | 'all';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify authentication
  const token = extractToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { format = 'csv', type = 'inventory' } = req.query;

    // Validate format and type
    if (!['csv', 'json', 'pdf'].includes(format as string)) {
      return res.status(400).json({ error: 'Invalid format' });
    }

    if (!['inventory', 'analytics', 'payments', 'all'].includes(type as string)) {
      return res.status(400).json({ error: 'Invalid export type' });
    }

    const data = await collectExportData(userId, type as ExportType);
    const fileName = generateFileName(type as ExportType, format as ExportFormat);

    // Set response headers
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      const csv = convertToCSV(data);
      return res.status(200).send(csv);
    } else if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.status(200).json(data);
    } else if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      // Note: PDF generation would require additional library (e.g., pdfkit)
      // For now, return JSON with instruction
      return res.status(501).json({
        error: 'PDF export not yet implemented',
        message: 'Please use CSV or JSON format',
        alternativeFormats: ['csv', 'json'],
      });
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (error) {
    console.error('[Export] Error:', error);
    return res.status(500).json({
      error: 'Export failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Collect data for export
 */
async function collectExportData(userId: string, type: ExportType): Promise<any> {
  const data: any = {
    export_type: type,
    export_date: new Date().toISOString(),
  };

  try {
    // Get user info
    const userResult = await sql`
      SELECT id, email, first_name, last_name, company, created_at
      FROM users
      WHERE id = ${userId}
    `;

    data.user = userResult.rows[0];

    if (type === 'inventory' || type === 'all') {
      // Get inventory data
      try {
        const inventoryResult = await sql.unsafe(`
          SELECT * FROM inventory_items WHERE user_id = '${userId}' LIMIT 10000
        `);
        data.inventory = inventoryResult.rows;
      } catch (e) {
        data.inventory = [];
      }
    }

    if (type === 'analytics' || type === 'all') {
      // Get analytics events
      try {
        const analyticsResult = await sql.unsafe(`
          SELECT * FROM analytics_events WHERE user_id = '${userId}' LIMIT 10000
        `);
        data.analytics = analyticsResult.rows;
      } catch (e) {
        data.analytics = [];
      }
    }

    if (type === 'payments' || type === 'all') {
      // Get payment history
      const paymentsResult = await sql`
        SELECT id, stripe_payment_intent_id, amount, currency, status, created_at
        FROM payments
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
      data.payments = paymentsResult.rows;

      // Get subscription info
      const subscriptionsResult = await sql`
        SELECT id, tier, status, current_period_start, current_period_end, created_at
        FROM subscriptions
        WHERE user_id = ${userId}
      `;
      data.subscriptions = subscriptionsResult.rows;
    }

    return data;
  } catch (error) {
    console.error('[Export] Data collection error:', error);
    throw error;
  }
}

/**
 * Convert data to CSV format
 */
function convertToCSV(data: any): string {
  let csv = '';

  // Export user info
  if (data.user) {
    csv += '# USER INFORMATION\n';
    csv += 'Field,Value\n';
    Object.entries(data.user).forEach(([key, value]) => {
      csv += `${key},"${String(value).replace(/"/g, '""')}"\n`;
    });
    csv += '\n\n';
  }

  // Export inventory
  if (data.inventory && Array.isArray(data.inventory) && data.inventory.length > 0) {
    csv += '# INVENTORY\n';
    const headers = Object.keys(data.inventory[0]);
    csv += headers.map((h) => `"${h}"`).join(',') + '\n';
    data.inventory.forEach((item: any) => {
      csv += headers.map((h) => `"${String(item[h] || '').replace(/"/g, '""')}"`).join(',') + '\n';
    });
    csv += '\n\n';
  }

  // Export analytics
  if (data.analytics && Array.isArray(data.analytics) && data.analytics.length > 0) {
    csv += '# ANALYTICS\n';
    const headers = Object.keys(data.analytics[0]);
    csv += headers.map((h) => `"${h}"`).join(',') + '\n';
    data.analytics.forEach((event: any) => {
      csv += headers.map((h) => `"${String(event[h] || '').replace(/"/g, '""')}"`).join(',') + '\n';
    });
    csv += '\n\n';
  }

  // Export payments
  if (data.payments && Array.isArray(data.payments) && data.payments.length > 0) {
    csv += '# PAYMENTS\n';
    const headers = Object.keys(data.payments[0]);
    csv += headers.map((h) => `"${h}"`).join(',') + '\n';
    data.payments.forEach((payment: any) => {
      csv +=
        headers.map((h) => `"${String(payment[h] || '').replace(/"/g, '""')}"`).join(',') + '\n';
    });
    csv += '\n\n';
  }

  return csv;
}

/**
 * Generate export file name
 */
function generateFileName(type: ExportType, format: ExportFormat): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `maycole-${type}-export-${timestamp}.${format}`;
}
