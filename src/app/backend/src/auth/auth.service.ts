import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}


    async signUp(signUpDto: SignUpDto): Promise<void> {
        const { name, email, password } = signUpDto;
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await this.userModel.create({
          name,
          email,
          password: hashedPassword,
        });
      }

      async login(LoginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = LoginDto;
    
        const user = await this.userModel.findOne({ email });
    
        if (!user) {
          throw new UnauthorizedException('Invalid email or password');
        }
    
        const isPasswordMatched = await bcrypt.compare(password, user.password);
    
        if (!isPasswordMatched) {
          throw new UnauthorizedException('Invalid email or password');
        }
    
        const payload = { id: user._id };
        const token = this.jwtService.sign(payload, { expiresIn: '8h' });
    
        return { token };
      }


    async getAllUsers(): Promise<UserDto[]> {
        const users = await this.userModel.find().exec();
        return users.map(user => ({ name: user.name, email: user.email }));
    }

    async getUserNameById(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.name;
  }

  async decodeToken(token: string): Promise<{ id: string }> {
    try {
        const decoded = this.jwtService.verify(token);
        return { id: decoded.id };
    } catch (error) {
        throw new UnauthorizedException('Invalid token');
    }
}
}
