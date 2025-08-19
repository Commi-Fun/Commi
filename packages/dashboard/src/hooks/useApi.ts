'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useOverviewStats() {
  return useQuery({
    queryKey: ['overview-stats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/stats/overview');
      return data;
    },
  });
}

export function useReferralStats() {
  return useQuery({
    queryKey: ['referral-stats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/stats/referrals');
      return data;
    },
  });
}