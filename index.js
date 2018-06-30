(function() {
  const now = window.moment();
  const startDateString = window.moment().format("L");
  const endDateString = window
    .moment()
    .add(1, "hour")
    .format("L");
  opsList(now, startDateString, endDateString, buildForm);
})();

// BOS API "working" statuses
const workingStatus = ["working", "shift coverage"];
// Elog default names
const actualNames = ["KelliAnn"];
// Desired name replacements
const desiredNames = ["Kelli"];

function buildForm(opsArray) {
  const form = [];
  const numberOfOps = 4;
  let i = 0;

  form.push(`<label for="shiftTitle">Shift Title</label>
  <div>
    <input id="shiftTitle" name="shiftTitle" type="text" value="${opsArray[0]}">
  </div>
  <label for="operators">Operators</label>
  <div>
    <input id="operator1" name="operator1" type="text" value="${opsArray[1]} ">
    <input id="opCC1" name="crew_chief" type="radio" checked="checked">
    <label for="opCC1">CC</label>
  </div>`);

  for (i = 2; i < opsArray.length; i++) {
    form.push(`<div>
      <input id="operator${i}" name="operator${i}" type="text" value="${
      opsArray[i]
    }">
      <input id="opCC${i}" name="crew_chief" type="radio">
      <label for="opCC${i}">CC</label>
    </div>`);
  }

  // Append extra inputs
  if (opsArray.length < numberOfOps + 2) {
    for (i; i < numberOfOps + 2; i++) {
      form.push(`<div>
        <input id="operator${i}" name="operator${i}" type="text" value="">
        <input id="opCC${i}" name="crew_chief" type="radio">
        <label for="opCC${i}">CC</label>
      </div>`);
    }
  }

  form.unshift('<form id="filled">');
  form.push("</form>");
  form.push('<button id="submit">Submit</button>');

  document.getElementById("container").innerHTML = form.join("");
  document
    .getElementById("submit")
    .addEventListener("click", debounce(submit, 600));
}

function submit() {
  const form = document.querySelectorAll("#filled input");
  const postArray = [];

  for (let i = 1; i < form.length; i += 2) {
    if (form[i].value !== "") {
      postArray.push(form[i].value);
    }
  }

  for (let i = 2; i < form.length; i += 2) {
    if (form[i].checked) {
      // Move crew chief to index 1 in array
      postArray.splice(
        0,
        0,
        postArray.splice(form[i].id.split("")[4] - 1, 1)[0]
      );
    }
  }

  postArray.unshift(form[0].value);

  makePost(postArray);

  return true;
}

function opsList(now, startDateString, endDateString, callback) {
  return getBosRoster(now, startDateString, endDateString, response => {
    callback(rosterFromXml(response.xml, response.now));
  });
}

function rosterFromXml(xmlRoster, now) {
  const x2js = new window.X2JS();
  const xmlString = new window.XMLSerializer().serializeToString(xmlRoster);
  const roster = x2js.xml2js(xmlString);
  const opsArray = [];
  const shiftInfoNow = shiftInfo(now);
  const shiftDay = roster.schedule.day;
  const shifts = Number.isInteger(shiftDay.length)
    ? shiftDay[0].shift
    : shiftDay.shift;

  const shift = shifts.filter(shift => shift.type === shiftInfoNow.type);
  const operators = shift[0].operator;

  for (let operator of operators) {
    const isCrewChief = operator.is_chief === "true";
    const isWorking = workingStatus.includes(operator.working_status);

    if (isCrewChief && isWorking) {
      // Put CC at beginning of array
      opsArray.unshift(opsNames(operator));
    } else if (isWorking) {
      opsArray.push(opsNames(operator));
    }
  }

  opsArray.unshift(shiftInfoNow.title);

  return opsArray;
}

function opsNames(operator) {
  if (actualNames.includes(operator.first_name)) {
    const actualNameIndex = actualNames.indexOf(operator.first_name);
    return `${desiredNames[actualNameIndex]} ${operator.last_name}`;
  } else {
    return `${operator.first_name} ${operator.last_name}`;
  }
}

function getBosRoster(now, startDateString, endDateString, callback) {
  const newDate = dateAdjust(now);

  const data = `action=get_schedule&start_date=${newDate.startDateString ||
    startDateString}&end_date=${newDate.endDateString || endDateString}`;

  return window.$
    .ajax({
      type: "POST",
      url: "https://www-bd.fnal.gov/BossOSchedule/schedule",
      cache: false,
      data: data,
      dataType: "XML"
    })
    .done(xml => {
      const x2js = new window.X2JS();
      const xmlString = new window.XMLSerializer().serializeToString(xml);
      console.log(x2js.xml2js(xmlString));
      newDate ? callback({ xml, now: newDate.now }) : callback({ xml, now });
    })
    .fail((jqXHR, textStatus, errorText) => {
      console.log("Error: ", jqXHR, " ", textStatus, " ", errorText);
    });
}

function dateAdjust(now) {
  // after 20:00 on Saturday or Sunday
  if (now.hour() > 19 && (now.day() === 0 || now.day() === 6)) {
    const dateChange = {};
    dateChange.now = window
      .moment()
      .add(1, "day")
      .startOf("day");
    dateChange.startDateString = now.format("L");
    dateChange.endDateString = now.add(1, "hour").format("L");
    return dateChange;
  }

  return false; // no date adjust needed
}

function shiftInfo(shiftTime) {
  const hour = shiftTime.hour();
  const day = shiftTime.day();
  const days = [weekend, weekday, weekday, weekday, weekday, weekday, weekend];
  const owlShift = [...range(0, 8)];
  const dayShift = [...range(8, 16)];
  const eveningShift = [...range(16, 24)];
  const dayShiftPlus = [...range(8, 20)];
  const owlShiftPlus = [...range(20, 24)];

  return shiftTitle(days[day]());

  function weekday() {
    let row;

    if (owlShift.includes(hour)) {
      row = 0;
    } else if (dayShift.includes(hour)) {
      row = 1;
    } else if (eveningShift.includes(hour)) {
      row = 2;
    } else {
      window.alert("Oh Noes! Something went wrong!");
      console.log("Weekday didn't match any hour...");
    }

    const cell = row * 7 + day;

    return { cell, owlPlus: false };
  }

  function weekend() {
    let nextDay = 0;
    let row;

    if (owlShift.includes(hour)) {
      row = 0;
    } else if (dayShiftPlus.includes(hour)) {
      row = 1;
    } else if (owlShiftPlus.includes(hour)) {
      row = 0;
      nextDay = 1;
    } else {
      window.alert("Oh Noes! Something went wrong!");
      console.log("Weekend didn't match any hour...");
    }

    const cell = row * 7 + day + nextDay;

    return { cell, owlPlus: nextDay };
  }

  function shiftTitle({ cell, owlPlus }) {
    const shiftinfo = { title: "", type: "" };

    if (cell === 0 || cell === 1 || (cell === 7 && owlPlus)) {
      shiftinfo.title = "Owl+ Shift Roster";
      shiftinfo.type = "Owl";
    } else if (cell === 7 || (cell > 12 && cell < 15)) {
      shiftinfo.title = "Day+ Shift Roster";
      shiftinfo.type = "Day";
    } else if (cell > 0 && cell < 8) {
      shiftinfo.title = "Owl Shift Roster";
      shiftinfo.type = "Owl";
    } else if (cell > 7 && cell < 13) {
      shiftinfo.title = "Day Shift Roster";
      shiftinfo.type = "Day";
    } else if (cell > 14 && cell <= 19) {
      shiftinfo.title = "Evening Shift Roster";
      shiftinfo.type = "Evening";
    }

    return shiftinfo;
  }
}

function makePost(array) {
  const baseUri = "https://www-bd.fnal.gov/Elog/api/search/entries?";
  const query = "orCategoryName=Shift+Change&entryLimit=1";
  const uri = baseUri + query;

  window
    .fetch(uri)
    .then(response => response.json())
    .then(jsonEntry => rosterPost(jsonEntry[0].id, array));
}

function rosterPost(id, array) {
  const entryArray = [];
  const formData = new window.FormData();

  entryArray.push(`<u><strong>${array[0]}</strong></u>
                  <ul>
                    <li>${array[1]} <strong>CC</strong></li>`);

  for (let i = 2; i < array.length; i++) {
    entryArray.push(`<li>${array[i]}</li>`);
  }

  entryArray.push("</ul>");

  formData.append("entryId", id);
  formData.append("text", entryArray.join(""));

  window.$
    .ajax({
      url: "https://www-bd.fnal.gov/Elog/api/add/comment",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false
    })
    .done(function() {
      window.alert("Comment Successfully submitted");
      console.log("POST success");
    })
    .fail(function() {
      window.alert("Something went wrong");
      console.log("POST error");
    });
}

function* range(begin, end, interval = 1) {
  for (let i = begin; i < end; i += interval) {
    yield i;
  }
}

/**
 * Caracteristica de Guzman
 * Prevent multiple clicks within designated time
 * @param {Function} fn Function to be executed after waiting
 * @param {Integer} ms Time to wait before executing function
 */
function debounce(fn, ms) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}
