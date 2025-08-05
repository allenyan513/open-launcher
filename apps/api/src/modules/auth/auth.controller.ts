import {
  Controller,
  UseGuards,
  Get,
  Req,
  Res,
  Logger,
  Post,
  Body,
  Session,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { GithubOauthGuard } from '@src/modules/auth/guards/github-oauth.guard';
import { EmailMagicGuard } from '@src/modules/auth/guards/email-magic.guard';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guards';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@repo/shared';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {}

  @UseGuards(GoogleOauthGuard)
  @Get('callback/google')
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = this.authService.generateJwt(req.user);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const redirectParam = req.query.state as string;
    const redirectUrl = redirectParam
      ? `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/${redirectParam}`
      : `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/`;
    return res.redirect(redirectUrl);
  }

  @UseGuards(GithubOauthGuard)
  @Get('github')
  async githubAuth() {}

  @UseGuards(GithubOauthGuard)
  @Get('callback/github')
  async githubAuthCallback(@Req() req, @Res() res: Response) {
    const token = this.authService.generateJwt(req.user);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const redirectParam = req.query.state as string;
    const redirectUrl = redirectParam
      ? `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/${redirectParam}`
      : `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/`;

    return res.redirect(redirectUrl);
  }

  @Post('send-magic-link')
  async sendLink(
    @Body('email') email: string,
    @Body('redirect') redirect?: string,
  ) {
    return this.authService.sendMagicLink(email, redirect);
  }

  @UseGuards(EmailMagicGuard)
  @Get('magic-login')
  async loginWithMagic(@Req() req, @Res() res: Response) {
    const token = this.authService.generateJwt(req.user);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const encodedRedirect = req.query.redirect as string;
    const redirectUrl = encodedRedirect
      ? `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/${encodedRedirect}`
      : `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/`;

    return res.redirect(redirectUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getSession')
  async getSession(@Jwt() jwt: JwtPayload) {
    return jwt;
  }


  @Get('signOut')
  signOut(@Req() req, @Res() res: Response) {
    res.clearCookie('access_token');
    const encodedRedirect = req.query.redirect as string;
    const redirectUrl = encodedRedirect
      ? `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/${encodedRedirect}`
      : `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/`;

    return res.redirect(redirectUrl);
  }

}
