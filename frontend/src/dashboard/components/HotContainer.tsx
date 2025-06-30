"use client";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CampaignCard from "@/dashboard/components/CampaignCard";
import Grid from "@mui/material/Grid";
import * as React from "react";

const mockData = Array.from({ length: 3 }).map(() => ({
  address: "EFMFaSsdgsdgewerwreump",
}));

const mockCampaignData = Array.from({ length: 4 }).map(() => ({
  address: "EFMFaSsdgsdgewerwreump",
  members: [
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Rf0ukJKUzQ28IPO8kqlkHXOpvB-OQl3f6Q&s",
    },
    {
      src: "",
    },
    {
      src: "https://i.namu.wiki/i/V2fxixCG-QESg0yhz_XC7zDn140e8r9GvUiwcM-5N2m24nDwDk0oqMHYEj0zslW3u5Yim1qgPmCB1DeChNclKg.webp",
    },
  ],
}));

const RoundIcon = () => {
  return (
    <div
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "#d9d9d9",
      }}
    />
  );
};

const HotContainer = () => {
  return (
    <Box>
      <Stack direction={"row"} alignItems={"center"} gap={1} sx={{ mb: 2 }}>
        <Typography component="h2" variant="h6">
          HOT Campaign
        </Typography>
        <LocalFireDepartmentIcon
          fontSize={"small"}
          sx={{ color: "var(--orange-100)" }}
        />
      </Stack>
      <Stack direction={"row"} gap={1}>
        {mockData.map((_, index) => (
          <Chip
            key={index}
            avatar={<RoundIcon />}
            sx={{ pl: 1 }}
            label={"OG"}
          ></Chip>
        ))}
      </Stack>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2), mt: 2 }}
      >
        {mockCampaignData.map((card, index) => (
          <CampaignCard key={index} {...card}></CampaignCard>
        ))}
      </Grid>
    </Box>
  );
};

export default HotContainer;
