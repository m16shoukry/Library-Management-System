import * as moment from 'moment';
// ** system calculate endBorrowDate +14 days by defualt from borrow date*/
export function calculateEndBorrowDate(): Date {
  const currentDate = moment();
  const endBorrowDate = currentDate.clone().add(14, 'days').toDate();
  return endBorrowDate;
}
