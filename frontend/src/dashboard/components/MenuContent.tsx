'use client'
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import {styled} from "@mui/material/styles";
import {customColors} from "@/shared-theme/themePrimitives";

const mainListItems = [
  { text: 'Campaign', icon: <HomeRoundedIcon sx={{color: 'red'}} /> },
  { text: 'My campaigns', icon: <AnalyticsRoundedIcon /> },
  { text: 'Airdrop Earn', icon: <PeopleRoundedIcon /> },
  { text: 'Message', icon: <AssignmentRoundedIcon /> },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

const StyledList = styled(List)({
  '& .Mui-selected': {
    background: `linear-gradient(to right, ${customColors.main["400"]} 0%, ${customColors.main["400"]} 50%, ${customColors.main["300"]} 75%, ${customColors.main["200"]} 100%)`,
    color: customColors.main["100"]
  }
})

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <StyledList dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} sx={{ display: 'block', px: 0 }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </StyledList>
      {/* <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
