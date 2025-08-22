'use client';

import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
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

  const claimRate = stats.whitelistCount > 0 ? (stats.engagementStats.claimed / stats.whitelistCount) * 100 : 0;
  const referralRate = stats.whitelistCount > 0 ? (stats.engagementStats.referred / stats.whitelistCount) * 100 : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Real-time statistics for whitelist and referral system
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <StatsCard
            title="Whitelist Entries"
            value={stats.whitelistCount}
            subtitle={`${claimRate.toFixed(1)}% claimed`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <StatsCard
            title="Total Referrals"
            value={stats.referralCount}
            subtitle={`${referralRate.toFixed(1)}% have referred others`}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          User Analytics
        </Typography>
        
        {/* User stats with status breakdown colors */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper sx={{ p: 2, bgcolor: 'grey.500', color: 'white' }}>
              <Typography variant="subtitle1">
                Total Users
              </Typography>
              <Typography variant="h4">
                {stats.totalUsers}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper sx={{ p: 2, bgcolor: 'info.main', color: 'white' }}>
              <Typography variant="subtitle1">
                Followed
              </Typography>
              <Typography variant="h4">
                {stats.engagementStats.followed}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="subtitle1">
                Posted
              </Typography>
              <Typography variant="h4">
                {stats.engagementStats.posted}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper sx={{ p: 2, bgcolor: 'warning.main', color: 'white' }}>
              <Typography variant="subtitle1">
                Referred Others
              </Typography>
              <Typography variant="h4">
                {stats.engagementStats.referred}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper sx={{ p: 2, bgcolor: 'success.main', color: 'white' }}>
              <Typography variant="subtitle1">
                Claimed
              </Typography>
              <Typography variant="h4">
                {stats.engagementStats.claimed}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Engagement Status
              </Typography>
              <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: stats.engagementStats.engaged, label: 'Engaged' },
                        { id: 1, value: stats.totalUsers - stats.engagementStats.engaged, label: 'Not Engaged' },
                      ],
                    },
                  ]}
                  width={400}
                  height={300}
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Growth (Last 6 Months)
              </Typography>
              <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
                <BarChart
                  xAxis={[{ 
                    scaleType: 'band', 
                    data: Object.keys(stats.usersByMonth).slice(-6) 
                  }]}
                  series={[{ 
                    data: Object.keys(stats.usersByMonth).slice(-6).map((month: string) => stats.usersByMonth[month]) 
                  }]}
                  width={400}
                  height={300}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}