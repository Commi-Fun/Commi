"use client";
import * as React from "react";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import Search from "./Search";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { customColors } from "@/shared-theme/themePrimitives";
import { useState } from "react";
import LaunchPoolModal from "@/dashboard/components/LaunchPoolModal";
import AddPlus from "@/components/icons/AddPlusIcon";

const RedButton = styled(Button)({
  backgroundColor: customColors.red["300"],
  color: customColors.red[800],
  fontSize: "1.125rem",
  height: "46px",
});

const GreenButton = styled(Button)({
  backgroundColor: customColors.green02["300"],
  color: customColors.green02["800"],
  fontSize: "1.125rem",
  height: "46px",
});

export default function Header() {
  const [open, setOpen] = useState(false);
  const onSubmit = (data: Record<string, string | number>) => {
    console.log("data", data);
    setOpen(false);
  };

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        py: 3,
        px: 3.75
      }}
      spacing={2}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Stack direction={"row"} gap={2}>
        <RedButton>
          <span
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "10px",
              backgroundColor: "#d9d9d9",
              marginRight: "4px",
            }}
          ></span>
          Beta Join
          <span
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "2px",
              backgroundColor: "#d9d9d9",
              marginLeft: "8px",
              marginRight: "4px",
            }}
          ></span>
          {`{Campaign Name}`}
        </RedButton>
        <GreenButton>
          <span
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "10px",
              backgroundColor: "#d9d9d9",
              marginRight: "4px",
            }}
          ></span>
          Zita Create{" "}
          <span
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "2px",
              backgroundColor: "#d9d9d9",
              marginLeft: "8px",
              marginRight: "4px",
            }}
          ></span>
          {`{Campaign Name}`}
        </GreenButton>
      </Stack>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Button
          variant="contained"
          size={"small"}
          startIcon={<AddPlus />}
          sx={{
            borderRadius: "1.25rem",
            height: "46px",
            color: customColors.main.Black,
            fontWeight: "bold",
            fontSize: "1.125rem",
            width: '179px'
          }}
          onClick={() => setOpen(true)}
        >
          Launch pool
        </Button>
        <Search />
      </Stack>
      <LaunchPoolModal onSubmit={onSubmit} open={open} setOpen={setOpen} />
    </Stack>
  );
}
