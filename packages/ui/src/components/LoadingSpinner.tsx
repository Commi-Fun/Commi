import React from 'react';
import { CircularProgress, Box, BoxProps } from '@mui/material';

interface LoadingSpinnerProps extends BoxProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = 'primary',
  ...boxProps
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100px"
      {...boxProps}
    >
      <CircularProgress size={size} color={color} />
    </Box>
  );
};