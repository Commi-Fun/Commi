import { Card, CardContent, Typography } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, subtitle, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {trend && (
          <Typography
            variant="body2"
            color={trend.isPositive ? 'success.main' : 'error.main'}
            sx={{ mt: 1 }}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}