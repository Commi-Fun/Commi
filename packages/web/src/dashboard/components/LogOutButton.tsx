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
        className="flex flex-col justify-center items-center gap-9"
        size="small"
        open={open}
        onClose={() => setOpen(false)}>
        <div className="flex items-center gap-2 mt-10">
          <ExitIcon className="text-[30px] text-main-White" />
          <span className="text-[1.5rem]">Log out of Twitter?</span>
        </div>
        <div className="flex justify-between w-full px-9 gap-4 mb-10">
          <CommiButton theme="primary" sx={{ width: 166 }} onClick={logOut}>
            log out
          </CommiButton>
          <CommiButton sx={{ width: 166 }} variant="outlined" onClick={() => setOpen(false)}>
            stay here
          </CommiButton>
        </div>
      </CommiModal>
    </div>
  )
}
