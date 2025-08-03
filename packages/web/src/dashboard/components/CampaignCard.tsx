import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { gray, customColors } from '@/shared-theme/themePrimitives'
import Button from '@mui/material/Button'
import Users from '@/components/icons/Users'
import ExternalLinkIcon from '@/components/icons/ExternalLinkIcon'
import Box from '@mui/material/Box'
import { XIcon } from '@/components/icons/XIcon'

function truncateMiddle(text: string): string {
  return text.slice(0, 5) + '...' + text.slice(-3)
}

interface Props {
  address: string
  members: Record<string, string>[]
}

const CampaignCard = ({ address, members }: Props) => {
  return (
    <Card
      style={{
        backgroundColor: customColors.blue['1200'],
        position: 'relative',
        borderRadius: '20px',
        width: '408px',
        height: 'fit-content',
      }}
      sx={{ p: 3 }}>
      <Box sx={{ position: 'absolute', top: '10px', right: '10px' }}>
        <ExternalLinkIcon />
      </Box>
      <Stack direction={'row'} gap={2} alignItems={'center'}>
        <Avatar
          variant={'rounded'}
          sx={{ width: '64px', height: '64px' }}
          src={'/images/campaign_image.png'}
        />
        <Stack gap={0.75} justifyContent={'start'}>
          <Stack direction={'row'} alignItems={'center'} gap={0.5}>
            <Typography fontSize={'1.125rem'} fontWeight={'bold'} pr={0.5}>
              Token name
            </Typography>
            <XIcon color={customColors.blue[500]} className="text-[1.5rem]" />
            <Users />
            <Typography
              sx={{
                color: customColors.main['Green01'],
                fontSize: '1rem',
                pl: 0.5,
              }}>
              1.0M
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                mb: '-0.2rem',
              }}
              color={customColors.blue[200]}>
              / 1.5M
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={1} alignItems={'center'}>
            <Typography sx={{ fontSize: '0.875rem', color: customColors.green02[800] }}>
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
            <Stack direction={'row'} gap={0.5} pl={1}>
              <Typography
                sx={{
                  color: customColors.blue[300],
                  alignSelf: 'end',
                  fontSize: '0.75rem',
                }}>
                {truncateMiddle(address)}
              </Typography>
              <ContentCopyIcon
                sx={{
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  alignSelf: 'end',
                  color: gray[300],
                  mb: '0.25rem',
                }}
              />
            </Stack>
          </Stack>
          <Stack>
            <Typography color={customColors.blue[300]} variant="caption">
              描述
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        justifyContent={'space-between'}
        direction={'row'}
        sx={{ mt: 1 }}
        gap={1}
        alignItems={'center'}>
        <Typography variant="subtitle2" color={customColors.blue[200]}>
          {`{X} LPS`}
        </Typography>
        <Stack direction={'row'} gap={1} alignItems={'center'}>
          <Typography variant="subtitle2" color={customColors.main['Green01']}>
            {`{X}`} Members Joined
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
      </Stack>

      <Button
        variant={'outlined'}
        sx={{
          mt: 1,
        }}
        fullWidth>
        Earn now
      </Button>
    </Card>
  )
}

export default CampaignCard
