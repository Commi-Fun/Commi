import CommiButton from '@/components/CommiButton'
import CommiModal from '@/components/CommiModal'
import { ExitIcon } from '@/components/icons/ExitIcon'
import { IconType } from '@/types/Icon'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const LogOutButton = (props: IconType) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const logOut = async () => {
    try {
      // 🎯 使用 signOut 的 callbackUrl 参数直接重定向
      await signOut({
        callbackUrl: '/invite',
        redirect: true, // 确保重定向生效
      })
      setOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
      // 如果 signOut 失败，手动跳转
      router.push('/invite')
      setOpen(false)
    }
  }

  return (
    <div>
      <ExitIcon {...props} onClick={() => setOpen(true)} />

      <CommiModal
        className="flex flex-col justify-center items-center gap-9 max-w-screen p-0"
        size="small"
        open={open}
        onClose={() => setOpen(false)}>
        <div className="w-full h-full p-[18px] lg:p-9 flex flex-col gap-4 lg:gap-9">
          <div className="flex items-center gap-2 w-full justify-center">
            <ExitIcon className="text-[30px] text-main-White" />
            <span className="text-[18px]  lg:text-[1.5rem]">Log out of Twitter?</span>
          </div>
          <div className="flex justify-between w-full px-9 gap-4">
            <CommiButton className="h-8" theme="primary" sx={{ width: 166 }} onClick={logOut}>
              log out
            </CommiButton>
            <CommiButton
              variant="outlined"
              sx={{ width: 166, height: { sx: '32px', lg: '40px' } }}
              onClick={() => setOpen(false)}>
              stay here
            </CommiButton>
          </div>
        </div>
      </CommiModal>
    </div>
  )
}
