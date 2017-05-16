const test = require('tape')
const shift = require('../lib/shiftInfo')
const moment = require('moment')

const owlPlus = {title: 'Owl+ Shift Roster', type: 'Owl'}
const owl = {title: 'Owl Shift Roster', type: 'Owl'}
const day = {title: 'Day Shift Roster', type: 'Day'}
const dayPlus = {title: 'Day+ Shift Roster', type: 'Day'}
const evening = {title: 'Evening Shift Roster', type: 'Evening'}

const sundayMidnight = moment({hour: 0, day: 0})
const sundayDay = moment({hour: 8, day: 0})
const sundayEvening = moment({hour: 16, day: 0})
const sundayNight = moment({hour: 20, day: 0})
const mondayMidnight = moment({hour: 0, day: 1})
const mondayDay = moment({hour: 8, day: 1})
const mondayEvening = moment({hour: 16, day: 1})
const mondayNight = moment({hour: 20, day: 1})
const tuesdayMidnight = moment({hour: 0, day: 2})
const tuesdayDay = moment({hour: 8, day: 2})
const tuesdayEvening = moment({hour: 16, day: 2})
const tuesdayNight = moment({hour: 20, day: 2})
const wednesdayMidnight = moment({hour: 0, day: 3})
const wednesdayDay = moment({hour: 8, day: 3})
const wednesdayEvening = moment({hour: 16, day: 3})
const wednesdayNight = moment({hour: 20, day: 3})
const thursdayMidnight = moment({hour: 0, day: 4})
const thursdayDay = moment({hour: 8, day: 4})
const thursdayEvening = moment({hour: 16, day: 4})
const thursdayNight = moment({hour: 20, day: 4})
const fridayMidnight = moment({hour: 0, day: 5})
const fridayDay = moment({hour: 8, day: 5})
const fridayEvening = moment({hour: 16, day: 5})
const fridayNight = moment({hour: 20, day: 5})
const saturdayMidnight = moment({hour: 0, day: 6})
const saturdayDay = moment({hour: 8, day: 6})
const saturdayEvening = moment({hour: 16, day: 6})
const saturdayNight = moment({hour: 20, day: 6})

test('shiftInfo', assert => {
  assert.deepEqual(shift.info(sundayMidnight), owlPlus, 'Sunday Midnight is Owl+ Shift')

  assert.deepEqual(shift.info(sundayDay), dayPlus, 'Sunday Day is Day+ Shift')

  assert.deepEqual(shift.info(sundayEvening), dayPlus, 'Sunday Evening is Day+ Shift')

  assert.deepEqual(shift.info(sundayNight), owlPlus, 'Sunday Night is Owl+ Shift')

  assert.deepEqual(shift.info(mondayMidnight), owlPlus, 'Monday Midnight is Owl+ Shift')

  assert.deepEqual(shift.info(mondayDay), day, 'Monday Day is Day Shift')

  assert.deepEqual(shift.info(mondayEvening), evening, 'Monday Evening is Evening Shift')

  assert.deepEqual(shift.info(mondayNight), evening, 'Monday Night is Evening Shift')

  assert.deepEqual(shift.info(tuesdayMidnight), owl, 'Tuesday Midnight is Owl Shift')

  assert.deepEqual(shift.info(tuesdayDay), day, 'Tuesday Day is Day Shift')

  assert.deepEqual(shift.info(tuesdayEvening), evening, 'Tuesday Evening is Evening Shift')

  assert.deepEqual(shift.info(tuesdayNight), evening, 'Tuesday Night is Evening Shift')

  assert.deepEqual(shift.info(wednesdayMidnight), owl, 'Wednesday Midnight is Owl Shift')

  assert.deepEqual(shift.info(wednesdayDay), day, 'Wednesday Day is Day Shift')

  assert.deepEqual(shift.info(wednesdayEvening), evening, 'Wednesday Evening is Evening Shift')

  assert.deepEqual(shift.info(wednesdayNight), evening, 'Wednesday Night is Evening Shift')

  assert.deepEqual(shift.info(thursdayMidnight), owl, 'Thursday Midnight is Owl Shift')

  assert.deepEqual(shift.info(thursdayDay), day, 'Thursday Day is Day Shift')

  assert.deepEqual(shift.info(thursdayEvening), evening, 'Thursday Evening is Evening Shift')

  assert.deepEqual(shift.info(thursdayNight), evening, 'Thursday Night is Evening Shift')

  assert.deepEqual(shift.info(fridayMidnight), owl, 'Friday Midnight is Owl Shift')

  assert.deepEqual(shift.info(fridayDay), day, 'Friday Day is Day Shift')

  assert.deepEqual(shift.info(fridayEvening), evening, 'Friday Evening is Evening Shift')

  assert.deepEqual(shift.info(fridayNight), evening, 'Friday Night is Evening Shift')

  assert.deepEqual(shift.info(saturdayMidnight), owl, 'Saturday Midnight is Owl Shift')

  assert.deepEqual(shift.info(saturdayDay), dayPlus, 'Saturday Day is Day+ Shift')

  assert.deepEqual(shift.info(saturdayEvening), dayPlus, 'Saturday Evening is Day+ Shift')

  assert.deepEqual(shift.info(saturdayNight), owlPlus, 'Saturday Night is Owl+ Shift')

  assert.end()
})
