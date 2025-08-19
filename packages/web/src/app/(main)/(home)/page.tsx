import MainGrid from '@/dashboard/components/MainGrid'
import SideMenu from '@/dashboard/components/SideMenu'

const Page = () => {
  return (
    <div className="w-full h-full flex grow">
      <SideMenu />
      <div className="grow min-w-0">
        <MainGrid />
      </div>
    </div>
  )
}

export default Page
