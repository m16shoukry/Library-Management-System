import {
  Controller,
  Get,
  Header,
  Query,
  Res,
  StreamableFile,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { USER_ROLE } from '../users/interfaces/user.interface';
import { ReportsService } from './reports.service';
import { SwaggerApiDocumentation } from '../core/decorators/swagger-api-documentation.decorator';
import { PeriodOfBorrowsDto } from './dto/borrow-periods.dto';
import { ErrorApiResponse } from 'src/core/dto/api-response/Error-api-response.dto';
import { GlobalExceptionFilter } from 'src/core/exception-filters/global-exception.filter';

@Controller('reports')
@ApiTags('reports')
@ApiBearerAuth()
// @UseGuards(JwtGuard, RolesGuard, ThrottlerGuard)
// @Roles(USER_ROLE.ADMIN)
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get('lastMonthOverDue')
  @Header(
    'Content-Disposition',
    'attachment; filename=last_month_overdue_borrows.xlsx',
  )
  @SwaggerApiDocumentation({
    summary: 'Exports all overdue borrows of the last month Report',
    modelType: Buffer,
  })
  async exportOverDueBorrowsLastMonth(
    @Res({ passthrough: true }) res: Response,
  ) {
    const buffer = await this.reportService.exportOverDueBorrowsLastMonth();
    return new StreamableFile(buffer);
  }

  @Get('lastMonthBorrows')
  @Header('Content-Disposition', 'attachment; filename=last_month_borrows.xlsx')
  @SwaggerApiDocumentation({
    summary: 'Exports all borrowing processes of the last month Report',
    modelType: Buffer,
  })
  async exportLastMonthBorrows(@Res({ passthrough: true }) res: Response) {
    const buffer = await this.reportService.exportLastMonthBorrows();
    return new StreamableFile(buffer);
  }

  @Get('period')
  @Header(
    'Content-Disposition',
    'attachment; filename=specific_period_borrows.xlsx',
  )
  @SwaggerApiDocumentation({
    summary: 'Exports the borrowing process in a specific period Report',
    modelType: Buffer,
  })
  async exportPeriodBorrows(
    @Res({ passthrough: true }) res: Response,
    @Query() periodOfBorrowsDto: PeriodOfBorrowsDto,
  ) {
    const buffer = await this.reportService.exportPeriodBorrows(
      periodOfBorrowsDto,
    );
    return new StreamableFile(buffer);
  }
}
