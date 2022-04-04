const Ajv = require('ajv');
const workingWeekdaysSchema = require('./schemas/workingWeekDays-schema.json');

const ajv = new Ajv({
  strict: false,
  allErrors: true,
});
ajv.addSchema(workingWeekdaysSchema, 'workingWeekdays');
/**
 *
 * @param {number[]} weekDays - numbers from 1 to 7
 * @example [1,2,5,6]
 */
exports.validateWorkingWeekDays = (weekDays) => {
  const validate = ajv.getSchema('workingWeekdays');
  validate(weekDays);
  if (validate.errors) {
    throw new Error('Non working week days have errors: ' + validate.errors.map((e) => e.message).toString());
  }
};
