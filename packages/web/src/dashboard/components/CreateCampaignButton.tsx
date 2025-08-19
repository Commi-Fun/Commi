import CommiButton from '@/components/CommiButton'
import CommiModal from '@/components/CommiModal'
import { CreateCampaignForm } from '@/components/CreateCampaignForm'
import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'
import { useState } from 'react'

export const CreateCampaignButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <CommiButton size="large" onClick={() => setOpen(true)}>
        <span>Create Campaign</span>
        <ArrowCircleRight className="text-[24px]" />
      </CommiButton>

      <CommiModal open={open} onClose={() => setOpen(false)} size="large">
        <CreateCampaignForm onClose={() => setOpen(false)} />
      </CommiModal>
    </>
  )
}
