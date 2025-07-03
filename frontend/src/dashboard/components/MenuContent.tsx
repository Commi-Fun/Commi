"use client";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { customColors } from "@/shared-theme/themePrimitives";
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
        src={"/personVoiceActive.svg"}
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

const StyledList = styled(List)({
  "& .MuiButtonBase-root.MuiListItemButton-root": {
    opacity: 1,
    padding: "0 1.25rem",
    height: '2.875rem',
  },
  "& .MuiButtonBase-root.Mui-selected": {
    background: `radial-gradient(circle at right center, #A3C958 0%, #325537 21%, #152026 36%, transparent 80%)`,
    backgroundColor: "transparent",
  },
  "& .MuiButtonBase-root .MuiListItemIcon-root": {
    minWidth: 'unset'
  },
  "& .MuiListItemText-root .MuiListItemText-primary": {
    fontWeight: "600",
    fontSize: "1.125rem",
    color: "#ffffff",
    marginLeft: "0.5rem"
  },
  "& .Mui-selected .MuiListItemText-root .MuiListItemText-primary": {
    color: customColors.main["Green01"],
  },
});

export default function MenuContent() {
  const [seletedIndex, setSelectedIndex] = useState<number>(0);
  return (
    <Stack sx={{ flexGrow: 1, justifyContent: "space-between" }}>
      <StyledList dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} sx={{ display: "block", p: 0, my: 1 }}>
            <ListItemButton
              onClick={() => setSelectedIndex(index)}
              selected={index === seletedIndex}
            >
              <ListItemIcon>
                {index === seletedIndex ? item["activeIcon"] : item["icon"]}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </StyledList>
    </Stack>
  );
}
