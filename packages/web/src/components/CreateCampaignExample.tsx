'use client'

import React from 'react'
import { CreateCampaignButton } from '@/dashboard/components/CreateCampaignButton'

export function CreateCampaignExample() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Campaign Management</h1>

      <div className="mb-8">
        <CreateCampaignButton />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          Click the "Create Campaign" button above to open the campaign creation modal. The form
          includes all the fields shown in your design:
        </p>
        <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
          <li>Wallet Address (with copy functionality)</li>
          <li>Token Selection</li>
          <li>Token Amount with MAX button</li>
          <li>Campaign Duration dropdown</li>
          <li>Description textarea</li>
          <li>Community and Twitter links</li>
        </ul>
      </div>
    </div>
  )
}
