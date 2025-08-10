import Image from 'next/image'

export const JumpOutside = () => {
  return (
    <div className="h-svh bg-green01-500 flex flex-col relative overflow-hidden">
      {/* 右上角的箭头 */}
      <div className="absolute top-[50px] right-10">
        <Image src="/images/curvedArrow.svg" alt="Arrow" width={100} height={100} />
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-col items-center text-center absolute top-50 w-full">
        {/* 虚线边框的指示框 */}
        <div className="flex flex-col align-middle justify-between border-4 border-dashed border-green01-1000 py-4 px-4 rounded-3xl">
          <p className={`text-[24px] font-extrabold text-black white-font-border`}>Tap menu</p>
          <div className="flex justify-center mt-2">
            <Image src={'/images/DownArrowWithWhiteStroke.svg'} alt="" width={18} height={15.8} />
          </div>
          <p className="text-[24px] font-bold text-black white-font-border mt-2">Open in browser</p>
        </div>

        {/* 模拟的浏览器按钮 */}
        <div className="flex items-center mt-9 gap-4">
          {/* 三个点的菜单图标 */}
          <div className="flex items-center justify-center gap-1.5 h-10 px-2.5 bg-green01-1000 rounded">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>

          {/* 地球图标和文字 */}
          <div className="flex items-center h-10 px-2.5 bg-green01-1000 rounded">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-black stroke-current stroke-2 mr-3">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-xl font-bold text-black">Open in Browser</span>
          </div>
        </div>
      </div>
    </div>
  )
}
