import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SwaggerApiDocumentation } from '../core/decorators/swagger-api-documentation.decorator';
import { AuthenticatedUserDto } from './dto/authenticatedUser.dto';
import { SuccessApiResponse } from '../core/dto/api-response/success-api-response.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { GetUserProfileDto } from '../users/dto/get-user.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SwaggerApiDocumentation({
    summary: 'Login users or admins',
    modelType: AuthenticatedUserDto,
  })
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const newUser = await this.authService.loginUser(loginUserDto);
    return new SuccessApiResponse<AuthenticatedUserDto>(newUser);
  }
}
