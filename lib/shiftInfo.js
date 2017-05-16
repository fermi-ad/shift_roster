const moment = require('moment')

function dateAdjust (now) {
  // after 20:00 on Saturday or Sunday
  if (now.hour() > 19 && (now.day() === 0 || now.day() === 6)) {
    return moment().add(1, 'day').startOf('day')
  }

  return now // no date adjust needed
}

function shiftInfo (shiftTime) {
  shiftTime = dateAdjust(shiftTime)
  const hour = shiftTime.hour()
  const day = shiftTime.day()
  const days = [weekend, weekday, weekday, weekday, weekday, weekday, weekend]
  const owlShift = [...range(0, 8)]
  const dayShift = [...range(8, 16)]
  const eveningShift = [...range(16, 24)]
  const dayShiftPlus = [...range(8, 20)]
  const owlShiftPlus = [...range(20, 24)]

  return shiftTitle(days[day](owlShift, dayShift, eveningShift, dayShiftPlus, owlShiftPlus, hour, day))
}

function weekday (owlShift, dayShift, eveningShift, dayShiftPlus, owlShiftPlus, hour, day) {
  let row

  if (owlShift.includes(hour)) {
    row = 0
  } else if (dayShift.includes(hour)) {
    row = 1
  } else if (eveningShift.includes(hour)) {
    row = 2
  } else {
    console.log("Weekday didn't match any hour...")
  }

  const cell = row * 7 + day

  return ({cell, owlPlus: false})
}

function weekend (owlShift, dayShift, eveningShift, dayShiftPlus, owlShiftPlus, hour, day) {
  let nextDay = 0
  let row

  if (owlShift.includes(hour)) {
    row = 0
  } else if (dayShiftPlus.includes(hour)) {
    row = 1
  } else if (owlShiftPlus.includes(hour)) {
    row = 0
    nextDay = 1
  } else {
    console.log("Weekend didn't match any hour...")
  }

  const cell = row * 7 + day + nextDay

  return ({cell, owlPlus: nextDay})
}

function shiftTitle ({cell, owlPlus}) {
  const shiftinfo = {title: '', type: ''}

  if (cell === 0 || cell === 1 || (cell === 7 && owlPlus)) {
    shiftinfo.title = 'Owl+ Shift Roster'
    shiftinfo.type = 'Owl'
  } else if (cell === 7 || (cell > 12 && cell < 15)) {
    shiftinfo.title = 'Day+ Shift Roster'
    shiftinfo.type = 'Day'
  } else if (cell > 0 && cell < 8) {
    shiftinfo.title = 'Owl Shift Roster'
    shiftinfo.type = 'Owl'
  } else if (cell > 7 && cell < 13) {
    shiftinfo.title = 'Day Shift Roster'
    shiftinfo.type = 'Day'
  } else if (cell > 14 && cell <= 19) {
    shiftinfo.title = 'Evening Shift Roster'
    shiftinfo.type = 'Evening'
  }

  return shiftinfo
}

function* range (begin, end, interval = 1) {
  for (let i = begin; i < end; i += interval) {
    yield i
  }
}

module.exports = {dateAdjust, info: shiftInfo}
