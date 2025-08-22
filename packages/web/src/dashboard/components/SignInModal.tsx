import CommiButton from '@/components/CommiButton'
import CommiModal from '@/components/CommiModal'
import { signIn } from 'next-auth/react'

type SignInModalProps = {
  open: boolean
  handleClose: () => void
}

const SignInModal = ({ open, handleClose }: SignInModalProps) => {
  const connectWithX = async () => {
    try {
      // Call NextAuth to sign in with the "x" provider
      await signIn('x', { redirect: false })
      handleClose()
    } catch (error) {
      console.error('Sign in with X failed:', error)
      // Optionally, show an error message to the user
    }
  }

  return (
    <CommiModal title="Log in or Sign up" onClose={handleClose} open={open}>
      <div className="flex gap-4">
        <CommiButton onClick={connectWithX} className="bg-black text-white hover:bg-gray-800">
          Continue with X
        </CommiButton>
      </div>
    </CommiModal>
  )
}

export default SignInModal
