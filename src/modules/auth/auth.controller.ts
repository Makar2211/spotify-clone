import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Get('login')
	login(@Res() res: Response) {
		const loginUrl = this.authService.getSpotifyLoginUrl();
		res.redirect(loginUrl);
	}

	@Get('callback')
	async callback(@Query('code') code: string, @Res() res: Response) {
		try {
			const token = await this.authService.getAccessToken(code);
			res.cookie('spotify_token', token.access_token, { httpOnly: true });
			res.redirect(process.env.CLIENT_URL)
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
