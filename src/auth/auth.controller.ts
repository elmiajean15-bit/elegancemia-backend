import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ClientAuthGuard } from 'src/common/guards/client-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(ClientAuthGuard)
  @Get('me')
  getClient(@Req() req) {
    return this.authService.getClient(req.user.userId);
  }

  @UseGuards(ClientAuthGuard)
  @Post('logout')
  logout(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.logout(token);
  }

  @Post('reset-password')
  async resetPassword(@Body('email') email: string) {
    return this.authService.resetPasswordRequest(email);
  }

  @Post('reset-password/confirm')
  async resetPasswordConfirm(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPasswordConfirm(token, newPassword);
  }
}
