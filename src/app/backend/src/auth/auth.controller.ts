import { Body, Controller, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor( private AuthService: AuthService) {}

    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
        return this.AuthService.signUp(signUpDto);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return this.AuthService.login(loginDto);
    }

    @Get('/users')
    async getAllUsers(): Promise<UserDto[]> {
        return this.AuthService.getAllUsers();
    }

    @Get('/user/:id/name')
  async getUserNameById(@Param('id') id: string): Promise<{ name: string }> {
    const userName = await this.AuthService.getUserNameById(id);
    return { name: userName };
  }

  @Post('/decode-token')
    async decodeToken(@Body('token') token: string): Promise<{ id: string }> {
        if (!token) {
            throw new UnauthorizedException('Token is required');
        }
        return this.AuthService.decodeToken(token);
    }
}
