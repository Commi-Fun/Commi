import {
  Controller,
  Body,
  UseGuards,
  Get,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth_guard';
import { WhitelistService } from '../services/whitelist_service';
import type { Request } from 'express'
import type { UserDTO, WhitelistDto } from '../models/dto'

@Controller('whitelists')
export class WhitelistController {
  constructor(
    private readonly whitelistService: WhitelistService
  ) { }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  async check(@Req() req: Request) {
    if (req.user == undefined) {
      throw new UnauthorizedException("Not login.");
    }
    const whitelist = await this.whitelistService.getWhitelist(req.user.twitterId);
    const whitelistDto: WhitelistDto = {
      status: whitelist?.status
    }
    return whitelistDto;

  }

  @Post('init')
  @UseGuards(JwtAuthGuard)
  async init(
    @Req() req: Request,
    @Body() data: WhitelistDto) {
    if (req.user == undefined) {
      throw new UnauthorizedException("Not login.");
    }

    const userDto: UserDTO = {
      userId: req.user.userId,
      twitterId: req.user.twitterId,
    }
    const whitelist = await this.whitelistService.createWhitelist(userDto, data.referralCode);
    const whitelistDto: WhitelistDto = {
      status: whitelist?.status
    }
    return whitelistDto;
  }

  @Post('claim')
  @UseGuards(JwtAuthGuard)
  async claim(@Req() req: Request) {
    if (req.user == undefined) {
      throw new UnauthorizedException("Not login.");
    }

    const userDto: UserDTO = {
      userId: req.user.userId,
      twitterId: req.user.twitterId,
    }
    return await this.whitelistService.claimWhitelist(userDto);
  }
}