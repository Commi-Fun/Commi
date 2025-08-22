import { Divider } from '@mui/material'
import React, { useContext, useState } from 'react'
import { AvatorGroup } from './AvatorGroup'
import CommiButton from '@/components/CommiButton'
import Image from 'next/image'
import { GlobalContext } from '@/context/GlobalContext'
import { PublicKey, Transaction } from '@solana/web3.js'
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

interface PoolInfoCardProps {
  tokenSupply?: string
  poolSize?: string
  poolSizeUsd?: string
  currentPrice?: string
  participants?: number
}

const PoolInfoCard = ({ address, status, setStatus }: any) => {
  const { campaigns } = useContext(GlobalContext)
  const targetCapaign = campaigns.find((item: any) => item.address === address)
  const [joined, setJoined] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const onClaimClick = async () => {
    if (status === 'init') {
      setStatus('joined')
    }
    if (status === 'claimable') {
      if (!publicKey) return
      try {
        // 1. 将地址字符串转换为 PublicKey 对象
        const recipientPubKey = new PublicKey('7GF8EZRresw2QH26XLSvc5WK9mEwEqho55PEbHc1MwPM')
        const mintPubKey = new PublicKey('9jK7su8LmSi3DUcKZfYJYdvycUkvRQa1EokcusNkpump')

        // 注意：代币数量需要处理精度。这里假设代币有 6 位小数
        // 在真实应用中，你应该先查询 mint 地址来获取实际的精度
        const tokenDecimals = 6
        const amountInSmallestUnit = parseFloat('100') * Math.pow(10, tokenDecimals)

        // 2. 找到发送者和接收者的关联代币账户 (ATA)
        // 发送者的 ATA
        const fromAta = await getAssociatedTokenAddress(mintPubKey, publicKey)
        // 接收者的 ATA
        const toAta = await getAssociatedTokenAddress(mintPubKey, recipientPubKey)

        // 3. 创建一个新的交易
        const transaction = new Transaction()

        // 4. 创建转账指令
        // 这是一个核心步骤，它描述了要执行的操作
        const transferInstruction = createTransferInstruction(
          fromAta, // 从哪个账户转出
          toAta, // 转入哪个账户
          publicKey, // 谁是所有者 (签名者)
          amountInSmallestUnit, // 转账数量 (最小单位)
        )

        // 5. 将指令添加到交易中
        transaction.add(transferInstruction)

        // 6. 使用 wallet-adapter 的 sendTransaction 方法发送交易
        // 它会自动处理 blockhash 和签名流程
        const txSignature = await sendTransaction(transaction, connection)

        // 7. (可选) 等待交易确认
        await connection.confirmTransaction(txSignature, 'processed')

        alert(`转账成功！交易签名: ${txSignature}`)
      } catch (err) {
        console.log('transaltion error', err)
      } finally {
      }
    }
  }

  return (
    <div className="flex w-[700px] bg-blue-950 rounded-2xl p-9 text-white relative overflow-hidden gap-8 justify-center items-center">
      <div>
        <Image width={215} height={280} src={'/images/SipCup.png'} alt="" />
      </div>
      <div className="space-y-4 flex flex-col">
        <p className="px-4 py-2 bg-blue-900 rounded-lg text-blue-200 font-bold text-sm">
          Total Supply: {targetCapaign.totalAmount}
        </p>
        <div className="flex items-center gap-2 font-bold text-lg w-full">
          <div className="w-1 h-4 bg-lime-400 rounded-full"></div>
          <span>Pool Size:</span>
          <span className="text-lime-400">{targetCapaign.poolSize}</span>
          <span className="-ml-1">
            {' '}
            ({((targetCapaign.poolSize / targetCapaign.totalAmount) * 100).toFixed(2)}%)
          </span>
          <span className="text-lime-400">≈ {targetCapaign.poolValue}Usd</span>
        </div>

        <div>
          <Divider className="bg-white" />
        </div>

        <div className="flex justify-end mt-4">
          <span className="font-medium text-sm">
            {targetCapaign.members.length} are sipping now
          </span>
          {/* <AvatorGroup members={[{ src: 'https://1.com' }, { src: 'https://2.com' }]} /> */}
        </div>

        <div className="flex justify-end">
          <button
            disabled={status === 'joined'}
            onClick={onClaimClick}
            className={`h-10 cursor-pointer rounded-full ${status === 'joined' ? 'bg-gray-500' : 'primary-linear'} w-60 font-bold text-base flex items-center justify-center text-black`}>
            {status === 'init' ? 'Join Now' : 'Claim'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PoolInfoCard
