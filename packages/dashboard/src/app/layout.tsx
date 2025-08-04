'use client';

import Link from 'next/link';
import { 
  AppBar, 
  Box, 
  Container, 
  CssBaseline, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Providers } from '@/components/Providers';
import './globals.css';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const navigation = [
  { name: 'Overview', href: '/' },
  { name: 'Users', href: '/users' },
  { name: 'Whitelist', href: '/whitelist' },
  { name: 'Referrals', href: '/referrals' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Providers>
            <Box sx={{ display: 'flex' }}>
              <AppBar position="fixed" sx={{ zIndex: 1300 }}>
                <Toolbar>
                  <Typography variant="h6" noWrap component="div">
                    Commi Internal Dashboard
                  </Typography>
                </Toolbar>
              </AppBar>
              <Drawer
                variant="permanent"
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                  },
                }}
              >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                  <List>
                    {navigation.map((item) => (
                      <ListItem key={item.name} disablePadding>
                        <Link href={item.href} passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                          <ListItemButton>
                            <ListItemText primary={item.name} />
                          </ListItemButton>
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="lg">
                  {children}
                </Container>
              </Box>
            </Box>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}