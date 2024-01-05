import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
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
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // **** user signup ****
  @Post('signup')
  @SwaggerApiDocumentation({
    summary: 'Signup for users',
    modelType: GetUserProfileDto,
  })
  async signup(@Body() signupUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(signupUserDto);
    return new SuccessApiResponse<GetUserProfileDto>(
      newUser,
      'Signedup SUCCESSFULLY',
    );
  }

  // **** Get all users paginated for only Admins ****
  @Get('list')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @SwaggerApiDocumentation({
    summary: '[Admin] Get Users List with pagination',
    modelType: GetUserProfileDto,
    isArray: true,
    isPagination: true,
  })
  async findAllPaginated(
    @Query() paginateSortDto: PaginateDto,
  ): Promise<PaginateResultDto<GetUserProfileDto>> {
    const usersList: PaginateResultDto<GetUserProfileDto> =
      await this.userService.findAllPaginated(paginateSortDto);
    return usersList;
  }

  // **** Update Profile ****
  @Patch('/me')
  @UseGuards(JwtGuard)
  @SwaggerApiDocumentation({
    summary: 'User Update thier Profile',
    modelType: GetUserProfileDto,
  })
  async updateProfile(
    @GetUser() user: GetUserProfileDto,
    @Body() updateProfileDTO: UpdateProfileDTO,
  ): Promise<BaseApiResponse<GetUserProfileDto>> {
    const userProfile = await this.userService.update(
      user.id,
      updateProfileDTO,
    );
    return new SuccessApiResponse<GetUserProfileDto>(
      userProfile,
      'UPDATED SUCCESSFULLY',
    );
  }

  // **** Deleta One Book ****
  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @SwaggerApiDocumentation({
    summary: '[Admin] Delete one Book by id',
    modelType: Object,
  })
  async delete(@Param('id') userId: number): Promise<BaseApiResponse<void>> {
    await this.userService.delete(userId);
    return new SuccessApiResponse<void>(null, 'DELETED SUCCESSFULLY');
  }
}
