'use client';

import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useUserStats } from '@/hooks/useApi';

export default function UsersPage() {
  const { data: stats, isLoading, error } = useUserStats();

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
        <Typography color="error">Failed to load user stats</Typography>
      </Box>
    );
  }

  if (!stats) return null;

  const columns: GridColDef[] = [
    { field: 'handle', headerName: 'Handle', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'followersCount', headerName: 'Followers', width: 120, type: 'number' },
    { field: 'tweetsCount', headerName: 'Tweets', width: 100, type: 'number' },
    { field: 'verified', headerName: 'Verified', width: 100, type: 'boolean' },
  ];

  const pieData = [
    { id: 0, value: stats.verifiedUsers, label: 'Verified' },
    { id: 1, value: stats.totalUsers - stats.verifiedUsers, label: 'Not Verified' },
  ];

  const monthLabels = Object.keys(stats.usersByMonth).slice(-6);
  const monthValues = monthLabels.map((month: string) => stats.usersByMonth[month]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Analytics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Verification Status
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
              User Growth (Last 6 Months)
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: monthLabels }]}
              series={[{ data: monthValues }]}
              width={400}
              height={300}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Average Followers
            </Typography>
            <Typography variant="h4">
              {Math.round(stats.aggregateStats._avg.followersCount || 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Average Following
            </Typography>
            <Typography variant="h4">
              {Math.round(stats.aggregateStats._avg.followingCount || 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Average Tweets
            </Typography>
            <Typography variant="h4">
              {Math.round(stats.aggregateStats._avg.tweetsCount || 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Verification Rate
            </Typography>
            <Typography variant="h4">
              {stats.totalUsers > 0 ? ((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
            </Typography>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Users by Followers
            </Typography>
            <DataGrid
              rows={stats.topUsersByFollowers}
              columns={columns}
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
      </Grid>
    </Box>
  );
}