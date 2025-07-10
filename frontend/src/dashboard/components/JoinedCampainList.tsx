'use client'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { styled } from '@mui/material/styles'
import Collapse from '@mui/material/Collapse'
import { useState } from 'react'
import Button from '@mui/material/Button'
import { customColors } from '@/shared-theme/themePrimitives'
import * as React from 'react'
import CommiButton from '@/components/CommiButton'

const StyledListItem = styled(ListItem)(() => ({
  '& .MuiButtonBase-root': {
    opacity: 1,
    justifyContent: 'space-between',
  },
}))

const JoinedCampaignList = () => {
  const [open, setOpen] = useState(true)
  return (
    <Stack sx={{ py: 2 }}>
      <Stack
        sx={{ px: '1.25rem', py: 1 }}
        direction="row"
        alignItems="center"
        justifyContent="space-between">
        <Typography
          color={customColors.main.White}
          alignItems={'center'}
          sx={{ fontWeight: '500', fontSize: '1rem' }}>
          Active Campaign
        </Typography>
        <Button
          onClick={() => setOpen(!open)}
          size="small"
          sx={{ p: 0, minWidth: '20px', height: '20px' }}>
          {open ? (
            <Image src={'/Chevron_Down.svg'} width={24} height={24} alt={'chevron_down'} />
          ) : (
            <Image src={'/Chevron_Up.svg'} width={24} height={24} alt={'chevron_up'} />
          )}
        </Button>
      </Stack>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            p: 0,
          }}>
          <StyledListItem sx={{ p: 0 }}>
            <ListItemButton>
              <Stack direction={'row'} alignItems={'center'} gap={1}>
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
                <Stack>
                  <Typography sx={{ fontWeight: '600', fontSize: '0.875rem' }}>
                    Token Name
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: '500',
                      fontSize: '0.75rem',
                      color: customColors.green02['800'],
                    }}>
                    MCap $12.34M
                  </Typography>
                  <Stack direction={'row'}>
                    <Typography
                      sx={{
                        fontWeight: '500',
                        fontSize: '0.625rem',
                        color: customColors.blue['200'],
                      }}>
                      Claimed
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: '500',
                        fontSize: '0.625rem',
                        color: customColors.main.White,
                        ml: '4px',
                      }}>
                      {' '}
                      $12.34
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <CommiButton type={'button-common-small'}>Claim</CommiButton>
            </ListItemButton>
          </StyledListItem>
        </List>
      </Collapse>
    </Stack>
  )
}

export default JoinedCampaignList
