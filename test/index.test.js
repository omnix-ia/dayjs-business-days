import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import businessDays from '../src';

dayjs.extend(businessDays);
dayjs.extend(isoWeek);

it('Should only be a business day Monday to Friday', () => {
  dayjs.setWorkingWeekdays([1, 2, 3, 4, 5]);
  expect(dayjs().startOf('week').isBusinessDay()).toBe(false);
  expect(dayjs().endOf('week').isBusinessDay()).toBe(false);
  expect(dayjs('2020-04-01T00:00:00.000').isBusinessDay()).toBe(true);
  expect(dayjs('1994-11-15T00:00:00.000').isBusinessDay()).toBe(true);
  expect(dayjs('2019-12-28T00:00:00.000').isBusinessDay()).toBe(false);
});

it('Should skip non-business days when adding to a date', () => {
  dayjs.setWorkingWeekdays([1, 2, 3, 4, 5]);
  expect(dayjs('2019-12-20T00:00:00.000').businessDaysAdd(1).valueOf()).toBe(dayjs('2019-12-23T00:00:00.000').valueOf());
  expect(dayjs('2019-12-16T00:00:00.000').businessDaysAdd(5).valueOf()).toBe(dayjs('2019-12-23T00:00:00.000').valueOf());
  expect(dayjs('2019-12-20T00:00:00.000').businessDaysAdd(7).valueOf()).toBe(dayjs('2019-12-31T00:00:00.000').valueOf());
  expect(dayjs('2019-12-02T00:00:00.000').businessDaysAdd(21).valueOf()).toBe(dayjs('2019-12-31T00:00:00.000').valueOf());
});

it('Should skip non-business days when subtracting from a date', () => {
  dayjs.setWorkingWeekdays([1, 2, 3, 4, 5]);
  expect(dayjs('2019-12-23T00:00:00.000').businessDaysSubtract(1).valueOf()).toBe(dayjs('2019-12-20T00:00:00.000').valueOf());
  expect(dayjs('2019-12-23T00:00:00.000').businessDaysSubtract(5).valueOf()).toBe(dayjs('2019-12-16T00:00:00.000').valueOf());
  expect(dayjs('2019-12-31T00:00:00.000').businessDaysSubtract(7).valueOf()).toBe(dayjs('2019-12-20T00:00:00.000').valueOf());
  expect(dayjs('2019-12-31T00:00:00.000').businessDaysSubtract(21).valueOf()).toBe(dayjs('2019-12-02T00:00:00.000').valueOf());
});

it('Should calculate the number of business days when performing a diff', () => {
  dayjs.setWorkingWeekdays([1, 2, 3, 4, 5]);
  expect(dayjs('2019-12-01').businessDiff(dayjs('2019-12-01'))).toBe(0);
  expect(dayjs('2020-04-01').businessDiff(dayjs('2020-03-25'))).toBe(5);
  expect(dayjs('2020-03-25').businessDiff(dayjs('2020-04-01'))).toBe(-5);
  expect(dayjs('2019-12-25').businessDiff(dayjs('2019-12-01'))).toBe(17);
  expect(dayjs('2019-12-01').businessDiff(dayjs('2019-12-25'))).toBe(-17);
});

it('Should find the next Business Day', () => {
  dayjs.setWorkingWeekdays([1, 2, 3, 4, 5]);
  expect(dayjs('2020-04-01').nextBusinessDay().valueOf()).toBe(dayjs('2020-04-02').valueOf());
  expect(dayjs('2020-04-10').nextBusinessDay().valueOf()).toBe(dayjs('2020-04-13').valueOf());
});

it('Should find the previous Business Day', () => {
  dayjs.setWorkingWeekdays([1, 2, 3, 4, 5]);
  expect(dayjs('2020-04-02').prevBusinessDay().valueOf()).toBe(dayjs('2020-04-01').valueOf());
  expect(dayjs('2020-04-13').prevBusinessDay().valueOf()).toBe(dayjs('2020-04-10').valueOf());
});

it('Should return an array of businessDays in a given month', () => {
  dayjs.setWorkingWeekdays([1, 2, 3, 4, 5]);
  expect(dayjs(null).businessDaysInMonth()).toEqual([]);
  expect(dayjs('2020-04-01').businessDaysInMonth().length).toBe(22);
  expect(dayjs('2019-12-15').businessDaysInMonth().length).toBe(22);
  expect(dayjs('2020-04-01').businessDaysInMonth()[0].valueOf()).toBe(dayjs('2020-04-01').valueOf());
  expect(dayjs('2020-04-01').businessDaysInMonth()[21].valueOf()).toBe(dayjs('2020-04-30').valueOf());
});

it('Should return a two dimensional array of businessWeeks in a given month', () => {
  dayjs.setWorkingWeekdays([1, 2, 3, 4, 5]);
  expect(dayjs(null).businessWeeksInMonth()).toEqual([]);
  expect(dayjs('2020-04-01').businessWeeksInMonth().length).toBe(5);
  expect(dayjs('2020-04-01').businessWeeksInMonth()[0].length).toBe(3);
  expect(dayjs('2020-04-01').businessWeeksInMonth()[1].length).toBe(5);
  expect(dayjs('2020-04-01').businessWeeksInMonth()[2].length).toBe(5);
  expect(dayjs('2020-04-01').businessWeeksInMonth()[3].length).toBe(5);
  expect(dayjs('2020-04-01').businessWeeksInMonth()[4].length).toBe(4);
  expect(dayjs('2020-04-01').businessWeeksInMonth()[0][0].valueOf()).toBe(dayjs('2020-04-01').valueOf());
  expect(dayjs('2020-04-01').businessWeeksInMonth()[2][2].valueOf()).toBe(dayjs('2020-04-15').valueOf());

  expect(dayjs('2019-12-15').businessWeeksInMonth().length).toBe(5);
  expect(dayjs('2019-12-15').businessWeeksInMonth()[0].length).toBe(5);
  expect(dayjs('2019-12-15').businessWeeksInMonth()[1].length).toBe(5);
  expect(dayjs('2019-12-15').businessWeeksInMonth()[2].length).toBe(5);
  expect(dayjs('2019-12-15').businessWeeksInMonth()[3].length).toBe(5);
  expect(dayjs('2019-12-15').businessWeeksInMonth()[4].length).toBe(2);
  expect(dayjs('2019-12-15').businessWeeksInMonth()[1][4].valueOf()).toBe(dayjs('2019-12-13').valueOf());
});

it('Should not be a business day on holidays', () => {
  const july4th = '07/04';
  const laborDay = '09/07';

  const options = {
    holidays: [july4th, laborDay],
    holidayFormat: 'MM/DD',
  };
  dayjs.setHolidays(options.holidays, options.holidayFormat);
  dayjs.setWorkingWeekdays([1, 2, 3, 4, 5]);
  expect(dayjs('2020-07-04T00:00:00.000').isBusinessDay()).toBe(false);
  expect(dayjs('2020-09-07T00:00:00.000').isBusinessDay()).toBe(false);
  expect(dayjs('2020-07-04T00:00:00.000').isHoliday()).toBe(true);
  expect(dayjs('2020-09-07T00:00:00.000').isHoliday()).toBe(true);
});
