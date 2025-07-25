import { Injectable } from '@nestjs/common';
import axios from 'axios';

type TwitterUser = {
  id: string;
  name: string;
  screenName: string;
  avatar: string;
};


@Injectable()
export class TwitterService {
  private readonly apiUrl = 'https://api.twitter.com/2';

  constructor() { }

  async me(accessToken: string): Promise<TwitterUser | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          'user.fields': 'id,name,username,profile_image_url'
        }
      });

      return {
        id: response.data.data.id,
        name: response.data.data.name,
        screenName: response.data.data.username,
        avatar: response.data.data.profile_image_url
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to verify Twitter credentials: ' + error.message);
      }
      return null
    }
  }
}