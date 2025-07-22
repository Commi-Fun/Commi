import RedoIcon from '@/components/icons/RedoIcon'
import { customColors } from '@/shared-theme/themePrimitives'

const Page = () => {
  return (
    <div>
      <p className="text-[72px] text-main-Black font-extrabold font-shadow-white">2 STEPS</p>
      <p className="text-white font-extrabold font-shadow-black text-6xl stroke-black mt-1.5">
        GET WHITELIST EARLY!
      </p>
      <div className="flex items-center">
        <span className="w-4 h-4 rounded-full bg-green02-600"></span>
        <div className="flex items-center">
          <span className="text-2xl font-extrabold">Complete Tasks</span>

          <div className="flex items-center">
            <RedoIcon color={customColors.green01[200]} fontSize={28} />
            <span className="text-green01-200 text-[24px] font-bold">Check</span>
          </div>
        </div>
      </div>

      <div>
        <div>
          <span>empty circle</span>
          <span>Post to Join</span>
        </div>
        <button>Post</button>
      </div>
      <div>
        <div>
          <span>empty circle</span>
          <span>Invite 1 friend to get access</span>
        </div>
        <span>copy icon</span>
      </div>
      <div>
        🧃Airdrop season’s coming. I’m in Commi @commidotfun early — whitelist now or regret
        later:...
      </div>

      <div className="flex">
        <span>circle</span>
        <div>
          <p>Get Whitelist</p>
        </div>
      </div>
    </div>
  )
}

export default Page
