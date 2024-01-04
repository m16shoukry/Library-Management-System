import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { comparePassword } from './utils/passwords';
import { LoginUserDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signToken(userId: number, email: string, role: string) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = process.env.JWT_SECRET;

    const token = await this.jwt.signAsync(payload, {
      expiresIn: `${process.env.JWT_EXPIRATION_IN_HOURS}h`,
      secret,
    });

    return { access_token: token, role };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy({
      email: loginUserDto.email,
    });

    if (!user) throw new ForbiddenException();

    const pwMatches = comparePassword(loginUserDto.password, user.password);

    if (!pwMatches) throw new ForbiddenException('Wrong Email Or Password!');

    return this.signToken(user.id, user.email, user.role);
  }
}
