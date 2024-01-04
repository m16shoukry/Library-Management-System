import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDTO } from './dto/update-user.dto';
import { GetUserProfileDto } from './dto/get-user.dto';
import { PaginateResultDto } from '../core/dto/pagination/paginate-result-dto';
import { PaginateDto } from '../core/dto/pagination/paginate-sort-dto';
import { CreateUserDto } from '../auth/dto/createUser.dto';
import { hashPassword } from '../auth/utils/passwords';
import { USER_ROLE } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = hashPassword(createUserDto.password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role ? createUserDto.role : USER_ROLE.BORROWER,
    });
    await this.userRepository.save(newUser);

    return newUser;
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findAllPaginated(
    basePaginateDto: PaginateDto,
  ): Promise<PaginateResultDto<User>> {
    const { pageNumber, pageSize, sort, sortOrder } = basePaginateDto;

    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    const [data, count] = await this.userRepository.findAndCount({
      order: {
        [sort]: sortOrder,
      },
      skip,
      take,
    });

    const totalPages = Math.ceil(count / pageSize);

    return new PaginateResultDto<User>(
      data,
      count,
      pageNumber,
      pageSize,
      totalPages,
    );
  }

  async updateProfile(
    userId: number,
    updateProfileDTO: UpdateProfileDTO,
  ): Promise<GetUserProfileDto> {
    await this.userRepository.update(userId, updateProfileDTO);
    const userProfile = await this.userRepository.findOneBy({ id: userId });
    return userProfile as GetUserProfileDto;
  }
}
