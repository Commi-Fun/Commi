'use client'
import * as React from 'react'
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Stack,
  Typography,
} from '@mui/material'
import { useForm } from '@tanstack/react-form'
import Close from '@/components/icons/Close'
import { useAccount } from 'wagmi'

interface LaunchPoolModalProps {
  open: boolean
  onSubmit: (data: Record<string, string | number>) => void
  setOpen: (open: boolean) => void
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: '#0d0d0d',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function LaunchPoolModal({ open, onSubmit, setOpen }: LaunchPoolModalProps) {
  const account = useAccount()

  console.log('Account:', account)

  const form = useForm({
    defaultValues: {
      walletAddress: '',
      token: '',
      tokenAmount: '',
      tokenValue: '',
      duration: '6h',
      description: '',
      communityLink: '',
      twitterLink: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="launch-pool-modal-title"
      aria-describedby="launch-pool-modal-description">
      <Box sx={style}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography id="launch-pool-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Launch Pool
          </Typography>

          <Button onClick={() => setOpen(false)}>
            <Close />
          </Button>
        </Stack>

        <form
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}>
          <Stack spacing={3}>
            <form.Field name="walletAddress">
              {field => (
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor={field.name}>
                    Wallet Address
                  </InputLabel>
                  <TextField
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder="Enter wallet address"
                    sx={{ mt: 2 }}
                  />
                </FormControl>
              )}
            </form.Field>

            <form.Field name="token">
              {field => (
                <FormControl fullWidth>
                  <InputLabel shrink id="token-select-label">
                    Select Token
                  </InputLabel>
                  <Select
                    labelId="token-select-label"
                    id={field.name}
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    sx={{ mt: 2 }}>
                    <MenuItem value="eth">Ethereum (ETH)</MenuItem>
                    <MenuItem value="usdc">USD Coin (USDC)</MenuItem>
                    <MenuItem value="dai">Dai (DAI)</MenuItem>
                  </Select>
                </FormControl>
              )}
            </form.Field>

            <Stack direction="row" spacing={2}>
              <form.Field name="tokenAmount">
                {field => (
                  <FormControl fullWidth>
                    <InputLabel shrink htmlFor={field.name}>
                      Token Amount
                    </InputLabel>
                    <TextField
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="e.g., 100"
                      type="number"
                      sx={{ mt: 2 }}
                    />
                  </FormControl>
                )}
              </form.Field>
              <form.Field name="tokenValue">
                {field => (
                  <FormControl fullWidth>
                    <InputLabel shrink htmlFor={field.name}>
                      Value (USD)
                    </InputLabel>
                    <TextField
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="e.g., 5000"
                      type="number"
                      sx={{ mt: 2 }}
                    />
                  </FormControl>
                )}
              </form.Field>
            </Stack>

            <form.Field name="duration">
              {field => (
                <FormControl fullWidth>
                  <InputLabel shrink id="duration-select-label">
                    Activity Duration
                  </InputLabel>
                  <Select
                    labelId="duration-select-label"
                    id={field.name}
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    sx={{ mt: 2 }}>
                    <MenuItem value="6h">6 hours</MenuItem>
                    <MenuItem value="12h">12 hours</MenuItem>
                    <MenuItem value="18h">18 hours</MenuItem>
                    <MenuItem value="24h">24 hours</MenuItem>
                  </Select>
                </FormControl>
              )}
            </form.Field>

            <form.Field name="description">
              {field => (
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor={field.name}>
                    Description
                  </InputLabel>
                  <TextareaAutosize
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    minRows={4}
                    placeholder="Describe your campaign"
                    style={{
                      marginTop: '16px',
                      width: '100%',
                      color: 'white',
                      border: '1px solid grey',
                      padding: '8px',
                      borderRadius: '4px',
                    }}
                  />
                </FormControl>
              )}
            </form.Field>

            <form.Field name="communityLink">
              {field => (
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor={field.name}>
                    Community Link
                  </InputLabel>
                  <TextField
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder="e.g., https://discord.gg/community"
                    sx={{ mt: 2 }}
                  />
                </FormControl>
              )}
            </form.Field>

            <form.Field name="twitterLink">
              {field => (
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor={field.name}>
                    Twitter Link
                  </InputLabel>
                  <TextField
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder="e.g., https://twitter.com/handle"
                    sx={{ mt: 2 }}
                  />
                </FormControl>
              )}
            </form.Field>

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Create Campaign
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}
