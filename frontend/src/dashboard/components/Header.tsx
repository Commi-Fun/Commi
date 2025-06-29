'use client'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import Search from './Search';
import Button from '@mui/material/Button';
import {styled} from "@mui/material/styles";
import {customColors} from "@/shared-theme/themePrimitives";

const RedButton = styled(Button)({
    backgroundColor: '#4d3b41',
    color: '#ca7983',
    height: '1.75rem',
    fontSize: '0.75rem'
})

const GreenButton = styled(Button)({
    backgroundColor: '#024634',
    color: customColors.main["100"],
    height: '1.75rem',
    fontSize: '0.75rem'
})

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
      justifyContent={'space-between'}
      alignItems={'center'}
    >
        <Stack direction={'row'} gap={1}>
            <RedButton>
                Beta Join {`{Campaign Name}`}
            </RedButton>
            <GreenButton>
                Zita Create {`{Campaign Name}`}
            </GreenButton>
        </Stack>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Button variant="contained" size={"small"} startIcon={<AddIcon />} sx={{borderRadius: '1.25rem'}}>Launch pool</Button>
        <Search />
      </Stack>
    </Stack>
  );
}
