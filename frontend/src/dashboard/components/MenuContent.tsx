"use client";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { styled } from "@mui/material/styles";
import { customColors } from "@/shared-theme/themePrimitives";
import PersonVoiceSvg from "@/dashboard/svgs/PersonVoice";
import Image from "next/image";
import { useState } from "react";

const mainListItems = [
  {
    text: "Campaign",
    icon: (
      <Image width={24} height={24} src={"/personVoice.svg"} alt="Capmpaign" />
    ),
    activeIcon: (
      <Image
        width={24}
        height={24}
        src={"/personVOiceActive.svg"}
        alt="Capmpaign"
      />
    ),
  },
  {
    text: "My campaigns",
    icon: <Image width={24} height={24} src={"/person.svg"} alt="Capmpaign" />,
    activeIcon: (
      <Image width={24} height={24} src={"/personActive.svg"} alt="Capmpaign" />
    ),
  },
  {
    text: "Airdrop Earn",
    icon: <Image width={24} height={24} src={"/diamond.svg"} alt="Capmpaign" />,
    activeIcon: (
      <Image
        width={24}
        height={24}
        src={"/diamondActive.svg"}
        alt="Capmpaign"
      />
    ),
  },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon /> },
  { text: "About", icon: <InfoRoundedIcon /> },
  { text: "Feedback", icon: <HelpRoundedIcon /> },
];

const StyledList = styled(List)({
  "& .MuiButtonBase-root": {
    opacity: 1,
    padding: "0 1.25rem",
  },
  "& .Mui-selected": {
    background: `linear-gradient(to right, transparent 0%, transparent 59%, ${customColors.green["600"] + "00"} 59%, ${customColors.main["600"] + "80"} 100%)`,
    color: customColors.main["600"],
    fontWeight: "bold",
  },
  "& .MuiListItemButton-gutters.Mui-selected": {
    backgroundColor: "transparent",
  },
  "& .MuiListItemText-root .MuiListItemText-primary": {
    fontWeight: "bold",
    fontSize: "1.125rem",
    color: "#ffffff",
  },
});

export default function MenuContent() {
  const [seletedIndex, setSelectedIndex] = useState<number>(0);
  return (
    <Stack sx={{ flexGrow: 1, justifyContent: "space-between" }}>
      <StyledList dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} sx={{ display: "block", px: 0 }}>
            <ListItemButton
              onClick={() => setSelectedIndex(index)}
              selected={index === seletedIndex}
            >
              <ListItemIcon>
                {index === 0 ? item["activeIcon"] : item["icon"]}
              </ListItemIcon>
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
