import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import AddIcon from '@mui/icons-material/Add';
import Search from './Search';
import Button from '@mui/material/Button';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
      justifyContent={'end'}
    >
      <Stack direction="row" sx={{ gap: 1 }}>
        <Button variant="contained" startIcon={<AddIcon />} sx={{borderRadius: '1.25rem'}}>Launch pool</Button>
        <Search />
      </Stack>
    </Stack>
  );
}
