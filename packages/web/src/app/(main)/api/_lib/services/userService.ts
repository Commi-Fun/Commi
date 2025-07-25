import { UserDTO } from 'packages/web/src/api/models/dto'
import { UserDomain } from 'packages/web/src/api/models/domain'
import * as userRepository from '../repositories/userRepository';

export async function createUser(user: UserDTO) {
  const userDomain: UserDomain = {
    userId: user.userId,
    twitterId: user.twitterId,
    name: user.name,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
  return userRepository.upsertUser(userDomain);
}

export async function updateUser(user: UserDTO) {
  const userDomain: UserDomain = {} as UserDomain;
  if (user.twitterId) {
    const existingUser = await userRepository.findUserByTwitterId(user.twitterId);
    if (existingUser && existingUser.id !== user.userId) {
      throw new Error('Twitter ID is already in use');
    }
    userDomain.twitterId = user.twitterId;
  }
  if (user.profileImageUrl) userDomain.profileImageUrl = user.profileImageUrl;
  if (user.name) userDomain.name = user.name;
  if (user.username) userDomain.username = user.username;
  return userRepository.updateUser(userDomain);
}

export async function getUserByTwitterId(twitterId: string) {
  return userRepository.findUserByTwitterId(twitterId);
} 