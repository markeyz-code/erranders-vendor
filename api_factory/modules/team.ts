import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Team members for service providers.
 *
 * A shop invites people, sets each person's share of a completed job, and can suspend or remove them.
 * The share is applied when the job is marked complete, not when it is assigned.
 */
export const team_api = {
  list: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/team'),

  invite: (data: {
    name: string;
    email: string;
    phone?: string;
    role?: 'manager' | 'member';
    payoutType?: 'percent' | 'fixed';
    payoutSharePercent?: number;
    payoutFixedAmount?: number;
  }) => GATEWAY_ENDPOINT_WITH_AUTH.post('/team/invite', data),

  update: (
    id: string,
    data: Partial<{
      name: string;
      phone: string;
      role: 'manager' | 'member';
      payoutType: 'percent' | 'fixed';
      payoutSharePercent: number;
      payoutFixedAmount: number;
      status: string;
    }>,
  ) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/team/${id}`, data),

  remove: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/team/${id}`),

  mine: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/team/me'),

  /** Give a job to a team member, or clear it with an empty id. */
  assign: (appointmentId: string, teamMemberId: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch(`/appointments/${appointmentId}/assign`, { teamMemberId }),

  accept: (code: string) => GATEWAY_ENDPOINT_WITH_AUTH.post('/team/accept', { code }),
};
