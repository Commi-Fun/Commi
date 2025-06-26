import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import ImageIcon from "@mui/icons-material/Image";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import ArrowForwardIosIcon from "@mui/icons-material/KeyboardArrowRight";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import Box from "@mui/material/Box";
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Button from "@mui/material/Button";

const mainListItems = [
  { text: "Home" },
  { text: "Analytics" },
  { text: "Clients" },
  { text: "Tasks" },
];
const StyledListItem = styled(ListItem)(({ theme }) => ({
  "& .MuiButtonBase-root": {
    opacity: 1,
  },
}));

const JoinedCampaignList = () => {
  const [open, setOpen] = useState(true);
  return (
    <Stack sx={{ px: 1, py: 2 }}>
      <Stack sx={{px: 1, py: 1}} direction="row" alignItems="center" justifyContent="space-between">
        <Typography gutterBottom color="#999999" sx={{fontSize: '16px', fontWeight: 'semibold'}}>
          Campaigns
        </Typography>
        <Button onClick={() => setOpen(!open)} size="small" sx={{p: 0, minWidth: '20px', height: '20px'}}>
          {
            open ? <KeyboardArrowUp sx={{fontSize: '20px'}} /> : <KeyboardArrowDown sx={{fontSize: '20px'}} />
          }
        </Button>
      </Stack>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            p: 0,
          }}
        >
          <StyledListItem sx={{ p: 0 }}>
            <ListItemButton>
              <ListItemAvatar sx={{ minWidth: 44 }}>
                <Avatar variant="rounded" sx={{ width: 36, height: 36 }}>
                  <Image
                    className="dark:invert"
                    src="/Solana.png"
                    alt="Next.js logo"
                    width={36}
                    height={36}
                    priority
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Token name" secondary="%Rank: 3/1000" />
              <ArrowForwardIosIcon color="success" fontSize="small" />
            </ListItemButton>
          </StyledListItem>
        </List>
      </Collapse>
    </Stack>
  );
};

export default JoinedCampaignList;
