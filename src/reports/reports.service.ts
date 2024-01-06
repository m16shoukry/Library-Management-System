import { Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as moment from 'moment';
import { CheckoutsService } from '../checkouts/checkouts.service';
import { PeriodOfBorrowsDto } from './dto/borrow-periods.dto';
//TODO: refactor repeated code
@Injectable()
export class ReportsService {
  constructor(private readonly checkoutService: CheckoutsService) {}

  private async exportToXlsx(data: any[], headers: any[]): Promise<any> {
    if (data.length === 0) {
      throw new NotFoundException('There is no Available Data');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.columns = headers;

    data.forEach((row) => {
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async exportOverdueBorrowsLastMonth() {
    const overdueBorrows =
      await this.checkoutService.getOverdueBorrowsLastMonth();

    //** map the required data in the sheet */
    const data = overdueBorrows.map((checkout) => {
      //** calculate due in days */
      let returned = checkout.returnedDate
        ? moment(checkout.returnedDate)
        : null;
      let ended = moment(checkout.endBorrowDate);

      let dueDays: number;

      // Handle returnedDate is null
      if (returned !== null) {
        dueDays = returned.diff(ended, 'days');
      } else {
        dueDays = null;
      }
      return {
        id: checkout.id,
        userId: checkout.userId,
        userEmail: checkout.user.email,
        bookId: checkout.bookId,
        bookISBN: checkout.book.ISBN,
        bookName: checkout.book.title,
        status: checkout.status,
        startBorrowDate: checkout.startBorrowDate,
        endBorrowData: checkout.endBorrowDate,
        returnedDate: checkout.returnedDate,
        dueDays,
      };
    });
    const headers = [
      { header: 'BorrowID', key: 'id' },
      { header: 'UserID', key: 'userId' },
      { header: 'User Email', key: 'userEmail' },
      { header: 'BookID', key: 'bookId' },
      { header: 'Book ISBN', key: 'bookISBN' },
      { header: 'Book Name', key: 'bookName' },
      { header: 'CheckOut Status', key: 'status' },
      { header: 'Start Borrow Data', key: 'startBorrowDate' },
      { header: 'End Borrow Data', key: 'endBorrowData' },
      { header: 'Returned Date', key: 'returnedDate' },
      { header: 'Due Days Number', key: 'dueDays' },
    ];

    return await this.exportToXlsx(data, headers);
  }

  async exportLastMonthBorrows() {
    const lastMonthBorrows =
      await this.checkoutService.getAllBorrowsLastMonth();

    //** map the required data in the sheet */
    const data = lastMonthBorrows.map((checkout) => {
      //** calculate due in days */
      let returned = checkout.returnedDate
        ? moment(checkout.returnedDate)
        : null;
      let ended = moment(checkout.endBorrowDate);

      let dueDays: number;

      // Handle returnedDate is null
      if (returned !== null) {
        dueDays = returned.diff(ended, 'days');
      } else {
        dueDays = null;
      }
      return {
        id: checkout.id,
        userId: checkout.userId,
        userEmail: checkout.user.email,
        bookId: checkout.bookId,
        bookISBN: checkout.book.ISBN,
        bookName: checkout.book.title,
        status: checkout.status,
        startBorrowDate: checkout.startBorrowDate,
        endBorrowData: checkout.endBorrowDate,
        returnedDate: checkout.returnedDate,
        dueDays,
      };
    });

    //** set headers sheet and data key */
    const headers = [
      { header: 'BorrowID', key: 'id' },
      { header: 'UserID', key: 'userId' },
      { header: 'User Email', key: 'userEmail' },
      { header: 'BookID', key: 'bookId' },
      { header: 'Book ISBN', key: 'bookISBN' },
      { header: 'Book Name', key: 'bookName' },
      { header: 'CheckOut Status', key: 'status' },
      { header: 'Start Borrow Data', key: 'startBorrowDate' },
      { header: 'End Borrow Data', key: 'endBorrowData' },
      { header: 'Returned Date', key: 'returnedDate' },
      { header: 'Due Days Number', key: 'dueDays' },
    ];

    return await this.exportToXlsx(data, headers);
  }

  async exportPeriodBorrows(periodOfBorrowsDto: PeriodOfBorrowsDto) {
    const { startDate, endDate } = periodOfBorrowsDto;

    const periodBorrows = await this.checkoutService.getPeriodBorrows(
      startDate,
      endDate,
    );

    //** map the required data in the sheet */
    const data = periodBorrows.map((checkout) => {
      let returned = checkout.returnedDate
        ? moment(checkout.returnedDate)
        : null;
      let ended = moment(checkout.endBorrowDate);

      let dueDays: number;

      // Handle returnedDate is null
      if (returned !== null) {
        dueDays = returned.diff(ended, 'days');
      } else {
        dueDays = null;
      }
      return {
        id: checkout.id,
        userId: checkout.userId,
        userEmail: checkout.user.email,
        bookId: checkout.bookId,
        bookISBN: checkout.book.ISBN,
        bookName: checkout.book.title,
        status: checkout.status,
        startBorrowDate: checkout.startBorrowDate,
        endBorrowData: checkout.endBorrowDate,
        returnedDate: checkout.returnedDate,
        dueDays,
      };
    });

    //** set headers sheet and data key */
    const headers = [
      { header: 'BorrowID', key: 'id' },
      { header: 'UserID', key: 'userId' },
      { header: 'User Email', key: 'userEmail' },
      { header: 'BookID', key: 'bookId' },
      { header: 'Book ISBN', key: 'bookISBN' },
      { header: 'Book Name', key: 'bookName' },
      { header: 'CheckOut Status', key: 'status' },
      { header: 'Start Borrow Data', key: 'startBorrowDate' },
      { header: 'End Borrow Data', key: 'endBorrowData' },
      { header: 'Returned Date', key: 'returnedDate' },
      { header: 'Due Days Number', key: 'dueDays' },
    ];

    return await this.exportToXlsx(data, headers);
  }

  async calculateDueDays(
    returned: moment.Moment | null,
    ended: moment.Moment,
  ): Promise<number | null> {
    if (returned !== null) {
      return returned.diff(ended, 'days');
    } else {
      return null;
    }
  }
}
