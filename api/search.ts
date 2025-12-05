/**
 * Search & Filtering Endpoint
 * Advanced search and filtering for inventory/data
 *
 * GET /api/search?query=xxx&category=xxx&sort=xxx&page=1&limit=20
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db/client';
import { extractToken, verifyToken } from '@/lib/auth-utils';

interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
  [key: string]: any;
}

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  relevance_score?: number;
  created_at: Date;
  updated_at: Date;
}

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
    const filters = parseSearchFilters(req.query);
    const results = await performSearch(userId, filters);

    return res.status(200).json({
      success: true,
      query: filters.query,
      filters: {
        category: filters.category,
        status: filters.status,
        sort: filters.sort,
        page: filters.page,
        limit: filters.limit,
      },
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: results.total,
        pages: Math.ceil(results.total / filters.limit),
      },
      results: results.items,
    });
  } catch (error) {
    console.error('[Search] Error:', error);
    return res.status(500).json({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Parse search filters from query parameters
 */
function parseSearchFilters(query: any): SearchFilters {
  return {
    query: String(query.query || ''),
    category: query.category ? String(query.category) : undefined,
    status: query.status ? String(query.status) : undefined,
    sort: String(query.sort || 'created_at'),
    page: Math.max(1, parseInt(query.page as string) || 1),
    limit: Math.min(100, parseInt(query.limit as string) || 20),
    date_from: query.date_from ? String(query.date_from) : undefined,
    date_to: query.date_to ? String(query.date_to) : undefined,
  };
}

/**
 * Perform search with filters
 */
async function performSearch(
  userId: string,
  filters: SearchFilters
): Promise<{ total: number; items: SearchResult[] }> {
  try {
    // Build base query - search in a generic items/inventory table
    let whereClause = `user_id = '${userId}'`;

    // Add text search
    if (filters.query) {
      const searchQuery = filters.query.replace(/'/g, "''");
      whereClause += ` AND (
        title ILIKE '%${searchQuery}%' OR 
        description ILIKE '%${searchQuery}%' OR
        tags ILIKE '%${searchQuery}%'
      )`;
    }

    // Add category filter
    if (filters.category) {
      whereClause += ` AND category = '${filters.category.replace(/'/g, "''")}'`;
    }

    // Add status filter
    if (filters.status) {
      whereClause += ` AND status = '${filters.status.replace(/'/g, "''")}'`;
    }

    // Add date range filters
    if (filters.date_from) {
      whereClause += ` AND created_at >= '${filters.date_from}'`;
    }
    if (filters.date_to) {
      whereClause += ` AND created_at <= '${filters.date_to}'`;
    }

    // Parse sort parameter
    const sortField = getSortField(filters.sort || '');
    const sortOrder = filters.sort?.startsWith('-') ? 'DESC' : 'ASC';

    // Count total results
    const countResult = await sql.unsafe(
      `SELECT COUNT(*) as total FROM inventory_items WHERE ${whereClause}`
    );

    const total = parseInt(countResult.rows[0]?.total || '0');

    // Get paginated results
    const offset = (filters.page! - 1) * filters.limit!;
    const results = await sql.unsafe(
      `
      SELECT id, title, description, category, status, created_at, updated_at
      FROM inventory_items
      WHERE ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ${filters.limit!} OFFSET ${offset}
      `
    );

    return {
      total,
      items: results.rows as SearchResult[],
    };
  } catch (error) {
    // Fallback if table doesn't exist yet
    console.warn('[Search] Table query error, using fallback:', error);
    return { total: 0, items: [] };
  }
}

/**
 * Get sort field name and validate
 */
function getSortField(sort: string): string {
  const fieldMap: Record<string, string> = {
    created_at: 'created_at',
    '-created_at': 'created_at',
    updated_at: 'updated_at',
    '-updated_at': 'updated_at',
    title: 'title',
    '-title': 'title',
    category: 'category',
    '-category': 'category',
    status: 'status',
    '-status': 'status',
  };

  return fieldMap[sort] || 'created_at';
}
