import CheckBig from '@/components/icons/CheckBig'
import CopyIcon from '@/components/icons/CopyIcon'
import RedoIcon from '@/components/icons/RedoIcon'
import { customColors } from '@/shared-theme/themePrimitives'
import { useSession } from 'next-auth/react'

const firstStepAuthed = true

const Page = () => {
  return (
    <div className="w-[930px] absolute right-24.5 top-40">
      <p className="text-[72px] text-main-Black font-extrabold font-shadow-white">2 STEPS</p>
      <p className="text-white font-extrabold font-shadow-black text-6xl stroke-black mt-1.5">
        GET WHITELIST EARLY!
      </p>
      <div className="flex items-center justify-between w-full mt-46.5">
        <div className="flex items-center gap-4">
          <span className="w-4 h-4 rounded-full bg-green02-600"></span>
          <span className="text-2xl font-extrabold text-main-Black">Complete Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <RedoIcon color={customColors.green01[200]} fontSize={28} />
          <span className="text-green01-200 text-[24px] font-bold">Check</span>
        </div>
      </div>

      <div className="h-[360px] py-15.5 relative pl-11">
        <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-green01-900 rounded-full"></div>
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            {firstStepAuthed ? (
              <div className="w-6 h-6 bg-main-Green01 rounded-full flex items-center justify-center">
                <CheckBig className="text-main-Black text-[1.125rem]" />
              </div>
            ) : (
              <span
                style={{ borderWidth: '2px' }}
                className="w-6 h-6 rounded-full border-solid border-main-Black w-4 h-4"></span>
            )}
            <span className="font-bold text-[1.125rem]">Post to Join</span>
          </div>
          <button className="normal-button bg-main-Black text-main-Green01">Post</button>
        </div>
        <div className="flex justify-between mt-9">
          <div className="flex items-center gap-4">
            <span
              style={{ borderWidth: '2px' }}
              className="w-6 h-6 rounded-full border-solid border-main-Black w-4 h-4"></span>
            <span className="font-bold text-[1.125rem]">Invite 1 friend to get access</span>
          </div>
          <CopyIcon className="text-green01-200 cursor-pointer" />
        </div>
        <div className="mt-4 bg-green01-800 p-6 rounded-2xl">
          🧃Airdrop season’s coming. I’m in Commi @commidotfun early — whitelist now or regret
          later:...
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="w-4 h-4 rounded-full bg-green01-1000"></span>
        <span className="text-2xl font-extrabold text-main-Black">Get Whitelist</span>
      </div>
    </div>
  )
}

export default Page
