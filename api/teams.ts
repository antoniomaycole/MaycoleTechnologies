/**
 * API Endpoint: Teams
 * POST /api/teams - Create team
 * GET /api/teams - Get user's teams
 * GET /api/teams/:id - Get team details
 * PUT /api/teams/:id - Update team
 * DELETE /api/teams/:id - Delete team
 * POST /api/teams/:id/members - Add member
 * DELETE /api/teams/:id/members/:userId - Remove member
 * PUT /api/teams/:id/members/:userId - Update member role
 * POST /api/teams/:id/invites - Invite user
 */

import { logAction } from '../lib/audit-log-service';
import * as teamService from '../lib/team-service';

export default async function handleTeams(req: any, res: any) {
  const { method, query, body, headers } = req;
  const userId = req.userId; // From auth middleware
  const ipAddress = headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown';

  try {
    // POST /api/teams - Create new team
    if (method === 'POST' && !query.id) {
      const { name, description, slug } = body;

      if (!name) {
        return res.status(400).json({ error: 'Team name is required' });
      }

      const result = await teamService.createTeam(userId, name, { description, slug });

      if (result.success) {
        await logAction(userId, 'CREATE', 'team', `Created team: ${name}`, {
          resourceId: result.teamId,
          ipAddress,
        });

        return res.status(201).json({
          success: true,
          teamId: result.teamId,
          team: result.team,
        });
      } else {
        throw new Error(result.error);
      }
    }

    // GET /api/teams - Get user's teams
    if (method === 'GET' && !query.id) {
      const result = await teamService.getUserTeams(userId);

      if (result.success) {
        await logAction(userId, 'READ', 'team', 'Retrieved user teams', { ipAddress });
        return res.status(200).json({ success: true, teams: result.teams });
      } else {
        throw new Error(result.error);
      }
    }

    // GET /api/teams/:id - Get team details
    if (method === 'GET' && query.id) {
      const result = await teamService.getTeam(query.id);

      if (result.success && result.team) {
        await logAction(userId, 'READ', 'team', `Retrieved team: ${result.team.name}`, {
          resourceId: query.id,
          ipAddress,
        });

        return res.status(200).json({ success: true, team: result.team });
      } else {
        return res.status(404).json({ error: 'Team not found' });
      }
    }

    // PUT /api/teams/:id - Update team
    if (method === 'PUT' && query.id) {
      const hasPermission = await teamService.hasPermission(query.id, userId, 'manage', 'settings');

      if (!hasPermission) {
        await logAction(userId, 'UPDATE', 'team', `Unauthorized team update attempt`, {
          resourceId: query.id,
          status: 'failure',
          ipAddress,
        });

        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await teamService.updateTeamSettings(query.id, body);

      if (result.success) {
        await logAction(userId, 'UPDATE', 'team', `Updated team settings`, {
          resourceId: query.id,
          changes: { before: {}, after: body },
          ipAddress,
        });

        return res.status(200).json({ success: true, team: result.team });
      } else {
        throw new Error(result.error);
      }
    }

    // DELETE /api/teams/:id - Delete team
    if (method === 'DELETE' && query.id && !query.userId) {
      const result = await teamService.deleteTeam(query.id, userId);

      if (result.success) {
        await logAction(userId, 'DELETE', 'team', `Deleted team`, {
          resourceId: query.id,
          ipAddress,
        });

        return res.status(200).json({ success: true });
      } else {
        return res.status(403).json({ error: result.error });
      }
    }

    // POST /api/teams/:id/members - Add member
    if (method === 'POST' && query.id && !query.userId) {
      const hasPermission = await teamService.hasPermission(query.id, userId, 'manage', 'members');

      if (!hasPermission) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { userId: newUserId, email, name, role } = body;

      const result = await teamService.addTeamMember(query.id, newUserId, email, name, role);

      if (result.success) {
        await logAction(userId, 'CREATE', 'team', `Added member to team: ${email}`, {
          resourceId: query.id,
          metadata: { newMemberId: newUserId, role },
          ipAddress,
        });

        return res.status(201).json({ success: true, member: result.member });
      } else {
        throw new Error(result.error);
      }
    }

    // DELETE /api/teams/:id/members/:userId - Remove member
    if (method === 'DELETE' && query.id && query.userId) {
      const hasPermission = await teamService.hasPermission(query.id, userId, 'manage', 'members');

      if (!hasPermission) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await teamService.removeTeamMember(query.id, query.userId);

      if (result.success) {
        await logAction(userId, 'DELETE', 'team', `Removed member from team`, {
          resourceId: query.id,
          metadata: { removedUserId: query.userId },
          ipAddress,
        });

        return res.status(200).json({ success: true });
      } else {
        throw new Error(result.error);
      }
    }

    // PUT /api/teams/:id/members/:userId - Update member role
    if (method === 'PUT' && query.id && query.userId && body.role) {
      const hasPermission = await teamService.hasPermission(query.id, userId, 'manage', 'members');

      if (!hasPermission) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await teamService.updateMemberRole(query.id, query.userId, body.role);

      if (result.success) {
        await logAction(userId, 'UPDATE', 'team', `Updated member role`, {
          resourceId: query.id,
          changes: { after: { userId: query.userId, role: body.role } },
          ipAddress,
        });

        return res.status(200).json({ success: true });
      } else {
        throw new Error(result.error);
      }
    }

    // POST /api/teams/:id/invites - Send invite
    if (method === 'POST' && query.id && body.email) {
      const hasPermission = await teamService.hasPermission(query.id, userId, 'manage', 'members');

      if (!hasPermission) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await teamService.inviteToTeam(query.id, body.email, body.role || 'member');

      if (result.success) {
        await logAction(userId, 'CREATE', 'team', `Sent team invite to: ${body.email}`, {
          resourceId: query.id,
          metadata: { inviteeEmail: body.email },
          ipAddress,
        });

        return res.status(201).json({ success: true, inviteId: result.inviteId });
      } else {
        throw new Error(result.error);
      }
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (error) {
    console.error('[Teams API] Error:', error);

    await logAction(userId, 'API_CALL', 'team', 'Teams API error', {
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
