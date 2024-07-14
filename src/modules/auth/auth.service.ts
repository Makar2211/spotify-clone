import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomBytes } from 'crypto';
import * as qs from 'qs';

@Injectable()
export class AuthService {
	private readonly clientId: string;
	private readonly clientSecret: string;
	private readonly redirectUri: string;
	constructor(private configService: ConfigService) {
		this.clientId = this.configService.get<string>('client_id');
		this.clientSecret = this.configService.get<string>('client_secret');
		this.redirectUri = this.configService.get<string>('redirect_url');
	}

	generateRandomString(length: number): string {
		return randomBytes(length).toString('hex').slice(0, length);
	}

	getSpotifyLoginUrl(): string {
		const state = this.generateRandomString(16);
		const scope = 'user-read-private user-read-email';

		return (
			'https://accounts.spotify.com/authorize?' +
			qs.stringify({
				response_type: 'code',
				client_id: this.clientId,
				scope: scope,
				redirect_uri: this.redirectUri,
				state: state,
			})
		);
	}


	async getAccessToken(code: string): Promise<any> {
		const tokenUrl = 'https://accounts.spotify.com/api/token';
		const body = qs.stringify({
			grant_type: 'client_credentials',
			code: code,
			redirect_uri: this.redirectUri,
		});

		try {
			const response = await axios.post(tokenUrl, body, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
				},
			});
			return response.data;
		} catch (error) {
			throw new Error(`Failed to get access token: ${error.message}`);
		}
	}
}
