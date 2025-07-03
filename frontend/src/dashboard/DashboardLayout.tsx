"use client";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "@/dashboard/components/AppNavbar";
import Header from "@/dashboard/components/Header";import SideMenu from "@/dashboard/components/SideMenu";
import AppTheme from "@/shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "@/dashboard/theme/customizations";
import Divider from "@mui/material/Divider";
import { customColors } from "@/shared-theme/themePrimitives";
import { Metadata } from "next";


const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export const metadata: Metadata = {
  title: "Dashboard - My Campaigns",
  icons: {
    icon: "/logo.svg",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          backgroundColor: customColors.main.Black,
          height: "100vh",
        }}
      >
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={() => ({
            flexGrow: 1,
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Divider sx={{ width: "100%" }} />
            {children}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
