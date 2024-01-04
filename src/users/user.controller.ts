import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.entity';
import { BaseApiResponse } from '../core/dto/api-response/base-api-response.dto';
import { SuccessApiResponse } from '../core/dto/api-response/success-api-response.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { SwaggerApiDocumentation } from '../core/decorators/swagger-api-documentation.decorator';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { GetUserProfileDto } from './dto/get-user.dto';
import { UpdateProfileDTO } from './dto/update-user.dto';
import { PaginateResultDto } from '../core/dto/pagination/paginate-result-dto';
import { PaginateDto } from '../core/dto/pagination/paginate-sort-dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { USER_ROLE } from './interfaces/user.interface';
import { Roles } from '../auth/decorators/roles.decorators';
import { CreateUserDto } from '../auth/dto/createUser.dto';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // **** signup user ****
  @Post('signup')
  @SwaggerApiDocumentation({
    summary: 'Signup for users',
    modelType: User,
  })
  async signup(@Body() signupUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(signupUserDto);
    return new SuccessApiResponse<User>(newUser);
  }

  // **** Get all users paginated for only Admins ****
  @Get('list')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @SwaggerApiDocumentation({
    summary: 'Get Users List with pagination and sort for only Admins',
    modelType: User,
    isArray: true,
    isPagination: true,
  })
  async findAllPaginated(@Query() paginateSortDto: PaginateDto): Promise<any> {
    const usersList: PaginateResultDto<User> =
      await this.userService.findAllPaginated(paginateSortDto);
    return usersList;
  }

  // **** Update Profile ****
  @Put('/me')
  @UseGuards(JwtGuard)
  @SwaggerApiDocumentation({
    summary: 'Update User Profile',
    modelType: GetUserProfileDto,
  })
  async updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDTO: UpdateProfileDTO,
  ): Promise<BaseApiResponse<GetUserProfileDto>> {
    const userProfile = await this.userService.updateProfile(
      user.id,
      updateProfileDTO,
    );
    return new SuccessApiResponse<GetUserProfileDto>(userProfile);
  }
}
