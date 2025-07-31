import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import Button from '@mui/material/Button'
import ChevronRightRoundedIcon from '@/components/icons/ChevronRightMD'
import { customColors } from '@/shared-theme/themePrimitives'
import Users from '@/components/icons/Users'
import CopyIcon from '@/components/icons/CopyIcon'
import { XIcon } from '@/components/icons/XIcon'

const members = [
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Rf0ukJKUzQ28IPO8kqlkHXOpvB-OQl3f6Q&s',
  },
  {
    src: '',
  },
  {
    src: 'https://i.namu.wiki/i/V2fxixCG-QESg0yhz_XC7zDn140e8r9GvUiwcM-5N2m24nDwDk0oqMHYEj0zslW3u5Yim1qgPmCB1DeChNclKg.webp',
  },
]

const DetailHeader = () => {
  return (
    <Stack width={'100%'} mt={0.5}>
      <Stack direction={'row'} alignItems={'center'} gap={1}>
        <Typography color={customColors.blue['300']} variant="h1" fontSize={'24px'}>
          Campaign
        </Typography>
        <ChevronRightRoundedIcon />
        <Typography variant="h1" fontSize={'24px'}>
          Token Name
        </Typography>
      </Stack>
      <Stack direction={'row'} justifyContent={'space-between'} mt={4} alignItems={'center'}>
        <Stack>
          <Stack direction={'row'} alignItems={'center'} gap={3}>
            <Avatar
              src={'/images/campaign_image.png'}
              sx={{ width: '80px', height: '80px' }}
              alt="token name"
              variant="rounded"
            />
            <Stack gap={1}>
              <Stack direction={'row'} alignItems={'center'} gap={1}>
                <Typography variant={'h6'}>MEME NAME</Typography>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                  }}
                  src={'/images/fire.png'}
                />
                <Typography sx={{ px: 1 }} fontSize={'1.5rem'} color={customColors.blue['400']}>
                  |
                </Typography>
                <Stack direction={'row'} gap={0.5}>
                  <XIcon color={customColors.blue[500]} className="text-1.5rem" />
                  <Users />
                </Stack>
              </Stack>
              <Stack direction={'row'} gap={1} alignItems={'center'}>
                <Typography
                  color={customColors.green02['800']}
                  fontSize={'0.875em'}
                  fontWeight={500}>
                  MCap $39.7M
                </Typography>
                {members.map((mem, index) => (
                  <Avatar
                    key={index}
                    sx={{
                      width: '1rem',
                      height: '1rem',
                      ml: index === 0 ? 0 : '-0.75rem',
                    }}
                    src={mem.src}
                  />
                ))}

                <Stack direction={'row'} alignItems={'center'} gap={0.5} px={1}>
                  <Typography color={customColors.blue['300']} fontSize={'0.75em'}>
                    EFMFa...ump
                  </Typography>
                  <CopyIcon />
                </Stack>
              </Stack>
              <Typography color="gray">描述</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack gap={2} alignItems={'center'}>
          <Stack direction={'row'} alignItems={'center'} gap={1}>
            <Typography color={customColors.main.Green01} fontWeight={500}>
              X Members Joined
            </Typography>
            {members.map((mem, index) => (
              <Avatar
                key={index}
                sx={{
                  width: '1rem',
                  height: '1rem',
                  ml: index === 0 ? 0 : '-0.75rem',
                }}
                src={mem.src}
              />
            ))}
          </Stack>

          <Button
            sx={{ height: '40px', width: '200px', borderRadius: '20px' }}
            variant={'outlined'}>
            Earn Now
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default DetailHeader
