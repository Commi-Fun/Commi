// Export all shared UI components
export { LoadingSpinner } from './components/LoadingSpinner';
export { ErrorBoundary } from './components/ErrorBoundary';
export { DataCard } from './components/DataCard';

// Re-export commonly used Material-UI components for convenience
export {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Container,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  CircularProgress,
  LinearProgress,
} from '@mui/material';

// Re-export Material-UI icons
export {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';