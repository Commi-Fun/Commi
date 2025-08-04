'use client';

import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { StatsCard } from '@/components/StatsCard';
import { useOverviewStats } from '@/hooks/useApi';

export default function HomePage() {
  const { data: stats, isLoading, error } = useOverviewStats();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">Failed to load dashboard stats</Typography>
      </Box>
    );
  }

  if (!stats) return null;

  const claimedCount = stats.whitelistStatusCounts.find((s: any) => s.status === 'claimed')?._count || 0;
  const claimRate = stats.whitelistCount > 0 ? (claimedCount / stats.whitelistCount) * 100 : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Real-time statistics for users, whitelist, and referral system
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Total Users"
            value={stats.userCount}
            subtitle={`${stats.verifiedUserCount} verified`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Whitelist Entries"
            value={stats.whitelistCount}
            subtitle={`${claimRate.toFixed(1)}% claimed`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Total Referrals"
            value={stats.referralCount}
            subtitle="Active referral connections"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Verification Rate"
            value={`${stats.userCount > 0 ? ((stats.verifiedUserCount / stats.userCount) * 100).toFixed(1) : 0}%`}
            subtitle="Users verified"
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Whitelist Status Breakdown
        </Typography>
        <Grid container spacing={2}>
          {stats.whitelistStatusCounts.map((status: any) => (
            <Grid size={{ xs: 12, sm: 4 }} key={status.status}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                </Typography>
                <Typography variant="h4">
                  {status._count}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}