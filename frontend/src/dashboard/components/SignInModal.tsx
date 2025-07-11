import CommiModal from '@/components/CommiModal'
import CommiTypo from '@/components/CommiTypo'

type SignInModalProps = {
  open: boolean
  handleClose: () => void
}

const SignInModal = ({ open, handleClose }: SignInModalProps) => {
  return (
    <CommiModal title="Log in" onClose={handleClose} open={open}>
      <CommiTypo type="alert2">Log in to your account</CommiTypo>
    </CommiModal>
  )
}

export default SignInModal
