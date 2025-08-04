'use client';

import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useWhitelistStats } from '@/hooks/useApi';

export default function WhitelistPage() {
  const { data: stats, isLoading, error } = useWhitelistStats();

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
        <Typography color="error">Failed to load whitelist stats</Typography>
      </Box>
    );
  }

  if (!stats) return null;

  const columns: GridColDef[] = [
    { field: 'twitterId', headerName: 'Twitter ID', width: 150 },
    { 
      field: 'handle', 
      headerName: 'Handle', 
      width: 150,
      valueGetter: (value: any, row: any) => row.user?.handle || 'N/A',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      valueGetter: (value: any, row: any) => row.user?.name || 'N/A',
    },
    { field: 'referralCode', headerName: 'Referral Code', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'verified',
      headerName: 'Verified',
      width: 100,
      type: 'boolean',
      valueGetter: (value: any, row: any) => row.user?.verified || false,
    },
  ];

  const pieData = Object.entries(stats.statusMap).map(([status, count], i) => ({
    id: i,
    value: count as number,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }));

  const conversionData = [
    { stage: 'Registered', count: stats.statusMap['registered'] || 0 },
    { stage: 'Can Claim', count: stats.statusMap['can_claim'] || 0 },
    { stage: 'Claimed', count: stats.statusMap['claimed'] || 0 },
  ];

  const claimRate = stats.totalWhitelist > 0 
    ? ((stats.statusMap['claimed'] || 0) / stats.totalWhitelist) * 100 
    : 0;

  const conversionRate = (stats.statusMap['registered'] || 0) > 0
    ? ((stats.statusMap['claimed'] || 0) / (stats.statusMap['registered'] || 0)) * 100
    : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Whitelist Analytics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Whitelist Entries
            </Typography>
            <Typography variant="h3">
              {stats.totalWhitelist.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Claim Rate
            </Typography>
            <Typography variant="h3">
              {claimRate.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Conversion Rate
            </Typography>
            <Typography variant="h3">
              {conversionRate.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Status Distribution
            </Typography>
            <PieChart
              series={[
                {
                  data: pieData,
                },
              ]}
              width={400}
              height={300}
            />
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Conversion Funnel
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: conversionData.map((d: any) => d.stage) }]}
              series={[{ data: conversionData.map((d: any) => d.count) }]}
              width={400}
              height={300}
            />
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Status Breakdown
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ p: 2, bgcolor: 'info.main', color: 'white' }}>
                  <Typography variant="subtitle1">
                    Registered
                  </Typography>
                  <Typography variant="h4">
                    {stats.statusMap['registered'] || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ p: 2, bgcolor: 'warning.main', color: 'white' }}>
                  <Typography variant="subtitle1">
                    Can Claim
                  </Typography>
                  <Typography variant="h4">
                    {stats.statusMap['can_claim'] || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ p: 2, bgcolor: 'success.main', color: 'white' }}>
                  <Typography variant="subtitle1">
                    Claimed
                  </Typography>
                  <Typography variant="h4">
                    {stats.statusMap['claimed'] || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Whitelist Entries
            </Typography>
            <DataGrid
              rows={stats.recentWhitelist}
              columns={columns}
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