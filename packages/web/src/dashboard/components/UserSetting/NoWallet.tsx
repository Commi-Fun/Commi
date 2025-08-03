import CommiTypo from '@/components/CommiTypo'
import { WalletIcon } from '@/components/icons/WalletIcon'
import { Stack } from '@mui/material'

export const NoWallet = () => {
  return (
    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
      <WalletIcon />
      <CommiTypo type={'heading-h1'} colorType={'secondary'} mt={2}>
        No Wallet Connected
      </CommiTypo>
      <CommiTypo type={'title'} colorType={'secondary-2'} mt={0.5}>
        Connect a wallet to explore campaigns
      </CommiTypo>
    </Stack>
  )
}
