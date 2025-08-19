'use client';

import { Box, Grid, Paper, Typography, CircularProgress, Avatar } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useReferralStats } from '@/hooks/useApi';

export default function ReferralsPage() {
  const { data: stats, isLoading, error } = useReferralStats();

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
        <Typography color="error">Failed to load referral stats</Typography>
      </Box>
    );
  }

  if (!stats) return null;

  const chartData = stats.topReferrers.slice(0, 10).map((r: any) => ({
    handle: r.handle ? `@${r.handle}` : '@',
    count: r.referralCount,
    profileImageUrl: r.profileImageUrl,
    displayName: r.handle ? `@${r.handle}` : '@',
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Referral Network Analytics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Referrals
            </Typography>
            <Typography variant="h3">
              {stats.totalReferrals.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Unique Referrers
            </Typography>
            <Typography variant="h3">
              {stats.uniqueReferrersCount.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Avg Referrals per User
            </Typography>
            <Typography variant="h3">
              {stats.avgReferralsPerReferrer.toFixed(1)}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Top Referrer Count
            </Typography>
            <Typography variant="h3">
              {stats.topReferrers[0]?.referralCount || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top 10 Referrers
            </Typography>
            
            {/* Bar Chart */}
            <Box sx={{ 
              width: '100%', 
              overflowX: 'auto',
              '& .MuiChartsAxis-tickLabel': {
                fontSize: { xs: 10, sm: 12 }
              }
            }}>
              <BarChart
                xAxis={[{ 
                  scaleType: 'band', 
                  data: chartData.map((d: any) => d.displayName),
                  tickLabelStyle: {
                    angle: -45,
                    textAnchor: 'end',
                  },
                }]}
                series={[{ 
                  data: chartData.map((d: any) => d.count),
                  label: 'Referrals',
                }]}
                height={400}
                margin={{ bottom: 100 }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}