import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('login')
  login(@Body() body: AdminLoginDto) {
    return this.adminAuthService.login(body);
  }

  @UseGuards(AdminAuthGuard)
  @Get('me')
  getAdmin(@Req() req) {
    return this.adminAuthService.getAdmin(req.user.userId);
  }

  @UseGuards(AdminAuthGuard)
  @Post('logout')
  logout(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.adminAuthService.logout(token);
  }

  @Post('reset-password')
  async resetPassword(@Body('email') email: string) {
    return this.adminAuthService.resetPasswordRequest(email);
  }

  @Post('reset-password/confirm')
  async resetPasswordConfirm(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.adminAuthService.resetPasswordConfirm(token, newPassword);
  }
}
