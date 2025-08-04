'use client';

import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
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

  const referrerColumns: GridColDef[] = [
    { field: 'referrerTwitterId', headerName: 'Twitter ID', width: 150 },
    { field: 'handle', headerName: 'Handle', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'referralCount', headerName: 'Referrals', width: 120, type: 'number' },
    { field: 'verified', headerName: 'Verified', width: 100, type: 'boolean' },
  ];

  const recentColumns: GridColDef[] = [
    {
      field: 'referrerHandle',
      headerName: 'Referrer',
      width: 200,
      valueGetter: (value: any, row: any) => row.referrer?.handle || row.referrerTwitterId,
    },
    {
      field: 'refereeHandle',
      headerName: 'Referee',
      width: 200,
      valueGetter: (value: any, row: any) => row.referee?.handle || row.refereeTwitterId,
    },
    { field: 'referrerTwitterId', headerName: 'Referrer ID', width: 150 },
    { field: 'refereeTwitterId', headerName: 'Referee ID', width: 150 },
  ];

  const chartData = stats.topReferrers.slice(0, 10).map((r: any) => ({
    handle: r.handle || r.referrerTwitterId,
    count: r.referralCount,
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
            <BarChart
              xAxis={[{ 
                scaleType: 'band', 
                data: chartData.map((d: any) => d.handle),
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
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Referrers Leaderboard
            </Typography>
            <DataGrid
              rows={stats.topReferrers}
              columns={referrerColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Referrals
            </Typography>
            <DataGrid
              rows={stats.recentReferrals}
              columns={recentColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 20]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}