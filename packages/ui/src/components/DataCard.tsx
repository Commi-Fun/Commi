import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';

interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: {
    value: number;
    isPositive?: boolean;
  };
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
}) => {
  const getTrendColor = (isPositive: boolean = true) => {
    return isPositive ? 'success.main' : 'error.main';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={icon}
        title={
          <Typography variant="h6" component="div" color="text.secondary">
            {title}
          </Typography>
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="h4" component="div" color={`${color}.main`}>
          {value}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
        
        {trend && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="body2"
              sx={{ color: getTrendColor(trend.isPositive) }}
            >
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};