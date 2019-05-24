// Executes when Details tab is pressed
function detailsTab() {
  $('#detailstab').css('display', 'block')
  $('#applytab').css('display', 'none')
  $('#historytab').css('display', 'none')
  $('#DetailsButton').addClass(' active')
  $('#ApplyButton').removeClass(' active')
  $('#HistoryButton').removeClass(' active')
}
// Executes when Apply tab is pressed
function applyTab() {
  $('#applytab').css('display', 'block')
  $('#detailstab').css('display', 'none')
  $('#historytab').css('display', 'none')
  $('#ApplyButton').addClass(' active')
  $('#DetailsButton').removeClass(' active')
  $('#HistoryButton').removeClass(' active')
  loadDrive()
}

// Executes when History tab is pressed
function historyTab() {
  $('#historytab').css('display', 'block')
  $('#applytab').css('display', 'none')
  $('#detailstab').css('display', 'none')
  $('#HistoryButton').addClass(' active')
  $('#ApplyButton').removeClass(' active')
  $('#DetailsButton').removeClass(' active')
  loadHistory()
}

// Checking department
function departmentCheck() {
  var usn = $('#usn').val()
  usn = usn.toUpperCase(usn)
  $('#usn').val(usn)
  var flag = true
  if (usn.match('^4MW1[5-9][C,M,E][V,S,C,E][0-4][0-9][0-9]$')) {
    if (usn[5] === 'C') {
      if (usn[6] === 'V') {
        $('#department').val('CV')
      } else if (usn[6] === 'S') {
        $('#department').val('CSE')
      }
    } else if (usn[5] === 'M' && usn[6] === 'E') {
      $('#department').val('ME')
    } else if (usn[5] === 'E' && usn[6] === 'C') {
      $('#department').val('EC')
    }
  } else {
    $('#department').val('Enter valid USN to get department...')
  }
}

// Adding details to database
function UpdateDetails() {
  var uid = $.cookie('uid')
  var username = $('#fullname').val()
  var usn = $('#usn').val()
  var department = $('#department').val()
  var aggregate = $('#aggregate').val()
  var backlog = $('#activebacklog').prop('checked')
  if (username.length === 0 || usn.length === 0 || aggregate.length === 0) {
    $('#detailsreport')
      .removeClass('alert-success')
      .addClass('alert alert-danger')
      .html('All feilds are necessary')
  } else if (
    !(
      department === 'CSE' ||
      department === 'CV' ||
      department === 'EC' ||
      department === 'ME'
    )
  ) {
    $('#detailsreport')
      .removeClass('alert-success')
      .addClass('alert alert-danger')
      .html('Enter a valid USN!')
  } else if (parseInt(aggregate) < 0 || parseInt(aggregate) > 100) {
    $('#detailsreport')
      .removeClass('alert-success')
      .addClass('alert alert-danger')
      .html('Enter a valid aggregate marks')
  } else {
    $.post(
      'functions.php', {
        setuserdetails: true,
        uid: uid,
        fullname: username,
        usn: usn,
        department: department,
        aggregatemark: aggregate,
        backlog: backlog
      },
      function (data) {
        data = parseInt(data)
        if (data === 1) {
          $('#detailsreport')
            .removeClass('alert-danger')
            .addClass('alert alert-success')
            .html('Updated successfully')
        } else {
          $('#detailsreport')
            .removeClass('alert-success')
            .addClass('alert alert-danger')
            .html('Updation unsuccessful')
        }
      }
    )
  }
}

$(document).ready(function () {
  if ($.cookie('uid') === undefined) {
    $(location).attr('href', 'index.html')
  }
  var username = $.cookie('uid')
  $.post(
    'functions.php', {
      verifieduser: 'true',
      username: username
    },
    function (data) {
      data = parseInt(data)
      if (data === -1) {
        $(location).attr('href', 'index.html')
      } else if (data === 1) {
        $('#ApplyButton').removeProp('disabled')
        $('#HistoryButton').removeProp('disabled')
      } else {
        $('#ApplyButton').prop('disabled', 'true')
        $('#HistoryButton').prop('disabled', 'true')
      }
    }
  )
  // $.post(
  //   'functions.php', {
  //     getuserdetails: true,
  //     uid: username
  //   },
  //   function (data) {
  //     data = JSON.parse(data)
  //     if (data !== null) {
  //       if ($('#placed').val() !== 'false') {
  //         $('#ApplyButton').prop('disabled', 'true')
  //       }
  //     }
  //   }
  // )
  $.post(
    'functions.php', {
      getuserdetails: true,
      uid: username
    },
    function (data) {
      data = JSON.parse(data)
      if (data !== null) {
        $('#fullname').val(data.fullname)
        $('#usn').val(data.usn)
        $('#department').val(data.department)
        $('#aggregate').val(data.aggregatemark)
        if (data.backlog === 'true') data.backlog = true
        else data.backlog = false
        $('#activebacklog').prop('checked', data.backlog)
      }
    }
  )
})

function loadDrive() {
  var uid = $.cookie('uid')
  var x
  $.post(
    'functions.php', {
      getapplied: true,
      uid: uid
    },
    function (data) {
      x = JSON.parse(data)
    }
  )

  $.post(
    'functions.php', {
      getdrives: true
    },
    function (data) {
      data = JSON.parse(data)
      var text = ''
      var department = $('#department').val()
      var aggregate = $('#aggregate').val()
      var activebacklog = $('#activebacklog').prop('checked')
      if (data !== null) {
        $.each(data, (index, element) => {
          if (
            parseInt(element.aggregatemark) <= parseInt(aggregate) &&
            (activebacklog === element.backlog ||
              (activebacklog !== element.backlog && activebacklog === false)) &&
            element.department.indexOf(department) !== -1 &&
            new Date(element.drive_date) >= new Date()
          ) {
            text += '<div class="row"> <div class = "col-sm-10 card"><br/>'
            text += 'Name of the company : ' + element.name + '<br/>'
            text +=
              'Website of the company : <a href="' +
              element.website +
              '">' +
              element.website +
              '</a><br/>'
            text += 'Details of the company : ' + element.details + '<br/>'
            text += 'Job Post : ' + element.jobpost + '<br/>'
            text += 'Job Description :<br/> ' + element.jobdescription + '<br/>'
            text += 'Department : ' + element.department + '<br/>'
            text += 'Aggregate Marks : ' + element.aggregatemark + '<br/>'
            text += 'Registration Last Date : ' + element.reg_lastdate + '<br/>'
            text += 'Drive On : ' + element.drive_date + '<br/>'
            text += 'Location : ' + element.drivelocation + '<br/>'
            if (element.backlog === true) text += 'Active Backlog : Yes<br/>'
            else text += 'Active Backlog : No<br/>'
            text += '<br/></div><button class = "col-sm-2 btn btn-dark" '
            var flag = false
            if (x !== null) {
              $.each(x, (index, subelement) => {
                if (element.deptid === subelement.did)
                  flag = true
              })
            }
            if (flag === true) {
              text += 'disabled>Applied</button></div><br/>'
            } else {
              if (new Date(element.reg_lastdate) < new Date()) {
                text += ' disabled '
              }
              text +=
                'onclick="applyDrive(\'' +
                uid +
                "','" +
                element.deptid +
                "','" +
                $('#fullname').val() +
                '\')">Apply</button></div><br/>'
            }
            text += '</div></div><br/>'
          }
        })
      }
      $('#applytab').html(text)
    }
  )
}

function applyDrive(uid, did, cname) {
  $.post(
    'functions.php', {
      applydrive: true,
      uid: uid,
      did: did,
      name: cname
    },
    function (data) {
      data = parseInt(data)
      if (data === 0)
        alert('Unsuccessful')
      else
        alert('Successful')
      applyTab()
    }
  )
}

function signOut() {
  $.removeCookie('uid', {
    path: '/'
  })
  $(location).attr('href', 'index.html')
}

function loadHistory() {
  $.post(
    'functions.php', {
      historydrive: true,
      uid: $.cookie('uid')
    },
    function (data) {
      data = JSON.parse(data)
      var text = ''
      if (data !== null) {
        $.each(data, (index, element) => {
          text += '<div class="row"> <div class = "col-sm-12 card"><br/>'
          text += 'Name of the company : ' + element.name + '<br/>'
          text += 'Job Post : ' + element.jobpost + '<br/>'
          text += 'Job Description :<br/> ' + element.jobdescription + '<br/>'
          text += 'Department : ' + element.department + '<br/>'
          text += 'Aggregate Marks : ' + element.aggregatemark + '<br/>'
          text += 'Registration Last Date : ' + element.reg_lastdate + '<br/>'
          text += 'Drive On : ' + element.drive_date + '<br/>'
          text += 'Location : ' + element.drivelocation + '<br/>'
          if (element.backlog === true) text += 'Active Backlog : Yes<br/>'
          else text += 'Active Backlog : No<br/>'
          text += '</div></div><br/>'
        })
      }
      $('#historytab').html(text)
    }
  )
}