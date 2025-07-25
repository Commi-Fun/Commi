import { PrismaTransaction, getTransactionClient } from 'packages/db/src/index';
import { nanoid } from 'nanoid';
import { WhitelistDomain } from '../types/domain'

export enum WhitelistStatus {
  REGISTERED = "REGISTERED",
  CAN_CLAIM = "CAN_CLAIM",
  CLAIMED = "CLAIMED"
}

export async function createWhitelist(tx: PrismaTransaction, data: WhitelistDomain) {
  const client = getTransactionClient(tx);
  return client.whitelist.create({
    data: {
      userId: data.user.userId as number,
      twitterId: data.user.twitterId as string,
      referralCode: nanoid(6),
      status: data.status,
    },
  });
}

export async function updateWhitelist(tx: PrismaTransaction, data: WhitelistDomain) {
  const client = getTransactionClient(tx);
  return client.whitelist.update({
    where: {
      twitterId: data.user.twitterId as string,
      userId: data.user.userId as number,
    },
    data: {
      status: data.status,
    },
  });
}

export async function findWhitelistByTwitterId(tx: PrismaTransaction, twitterId: string) {
  const client = getTransactionClient(tx);
  return client.whitelist.findUnique({ where: { twitterId } });
}

export async function findWhitelistByReferralCode(tx: PrismaTransaction, code: string) {
  const client = getTransactionClient(tx);
  return client.whitelist.findUnique({ where: { referralCode: code } });
} 