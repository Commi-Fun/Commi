"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import OptionsMenu from "./OptionsMenu";
import JoinedCampaignList from "./JoinedCampainList";
import Chip from "@mui/material/Chip";
import { customColors } from "@/shared-theme/themePrimitives";
import SettingsIcon from "@mui/icons-material/Settings";
import Image from "next/image";
import Page from "@/app/page";

const drawerWidth = 240;

export default function SideMenu() {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {},
        backgroundColor: customColors.blue["1200"],
      }}
    >
      <Stack direction={"row"} alignItems={"end"} paddingX={2.5} py={3}>
        <Image src="/logo.svg" width={20} height={30} alt="logo"></Image>
        <Image src="/Commi.svg" width={76.8} height={17} alt="logo"></Image>
        <Image
          style={{ marginLeft: "8px" }}
          src="/mvp.svg"
          width={57}
          height={25}
          alt="logo"
        ></Image>
      </Stack>
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: "center",
          mt: 1,
          position: "relative",
        }}
        paddingX={2}
      >
        <Avatar
          alt="Riley Carter"
          src="https://images.steamusercontent.com/ugc/1637611602253477558/8D6958D1C1CF006D6D461206E0059C1FD4D00B2A/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
          sx={{ width: 64, height: 64, border: "3px solid #fff" }}
        />
        <Box sx={{ mr: "auto", minWidth: "154px" }}>
          <Stack direction={"row"} alignItems={"center"}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                fontSize: "1.125rem",
              }}
            >
              Beta-Q
            </Typography>
            <SettingsIcon
              fontSize={"medium"}
              sx={{
                position: "absolute",
                top: "6px",
                right: "16px",
                color: "gray",
              }}
            />
          </Stack>

          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            riley@email.com
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          mt: 2,
        }}
      >
        <MenuContent />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <JoinedCampaignList />
      </Box>
    </Box>
  );
}
