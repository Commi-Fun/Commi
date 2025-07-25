import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '../../../../db/generated/prisma/client';
import { UserRepository } from '../repositories/user_repository';
import { UserDTO } from '../models/dto';
import { UserDomain } from '../models/domain';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository
  ) { }

  async createUser(
    user: UserDTO
  ) {
    // prepare data
    const userDomain: UserDomain = {
      userId: user.userId,
      twitterId: user.twitterId,
      name: user.name,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
    };

    // execute UPSERT
    return this.userRepository.upsertUser(userDomain);
  }

  async updateUser(
    user: UserDTO
  ) {
    // prepare data
    const userDomain: UserDomain = {};

    if (user.twitterId) {
      // check if twitterId is used by others
      const existingUser = await this.userRepository.findUserByTwitterId(user.twitterId);

      if (existingUser && existingUser.id !== user.userId) {
        throw new BadRequestException('Twitter ID is already in use');
      }

      userDomain.twitterId = userDomain.twitterId;
    }

    if (user.profileImageUrl) userDomain.profileImageUrl = user.profileImageUrl;
    if (user.name) userDomain.name = user.name;
    if (user.username) userDomain.username = user.username;

    // execute UPDATE
    return this.userRepository.updateUser(userDomain);
  }

  async getUserByTwitterId(twitterId: string) {
    return this.userRepository.findUserByTwitterId(twitterId);
  }
}