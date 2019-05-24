// Executes when Companies tab is pressed
function companiesTab() {
  $('#companiestab').css('display', 'block')
  $('#drivestab').css('display', 'none')
  $('#placedtab').css('display', 'none')
  $('#studentdetailstab').css('display', 'none')
  $('#CompaniesButton').addClass(' active')
  $('#DriveButton').removeClass(' active')
  $('#PlacedButton').removeClass(' active')
  $('#StudentDetailsButton').removeClass(' active')
  loadCompany()
}

// Executes when Drives tab is pressed
function drivesTab() {
  $('#companiestab').css('display', 'none')
  $('#drivestab').css('display', 'block')
  $('#placedtab').css('display', 'none')
  $('#studentdetailstab').css('display', 'none')
  $('#CompaniesButton').removeClass(' active')
  $('#DriveButton').addClass(' active')
  $('#PlacedButton').removeClass(' active')
  $('#StudentDetailsButton').removeClass(' active')
  loadDrive()
}

// Executes when Placed tab is pressed
function placedTab() {
  $('#companiestab').css('display', 'none')
  $('#drivestab').css('display', 'none')
  $('#placedtab').css('display', 'block')
  $('#studentdetailstab').css('display', 'none')
  $('#CompaniesButton').removeClass(' active')
  $('#DriveButton').removeClass(' active')
  $('#PlacedButton').addClass(' active')
  $('#StudentDetailsButton').removeClass(' active')
  loadPlaced()
}
// Executes when Student Details tab is pressed
function studentdetailsTab() {
  $('#companiestab').css('display', 'none')
  $('#drivestab').css('display', 'none')
  $('#placedtab').css('display', 'none')
  $('#studentdetailstab').css('display', 'block')
  $('#CompaniesButton').removeClass(' active')
  $('#DriveButton').removeClass(' active')
  $('#PlacedButton').removeClass(' active')
  $('#StudentDetailsButton').addClass(' active')
  loadStudentDetails()
}

function verifyuser(uid) {
  $.post(
    'functions.php', {
      verifyuser: true,
      username: uid
    },
    function (data) {
      loadStudentDetails()
    }
  )
}

function addCompany() {
  var companyname = $('#nameofcompany').val()
  var companywebsite = $('#websiteofcompany').val()
  var companydetails = $('#detailsofcompany').val()
  $('#addcompanyreport')
    .addClass('alert')
    .prop('role', 'alert')
  var pattern = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/)?/
  if (
    companyname.length >= 3 &&
    companywebsite.length >= 5 &&
    pattern.test(companywebsite) &&
    companydetails.length >= 20
  ) {
    $.post(
      'functions.php', {
        addcompany: true,
        companyname: companyname,
        companywebsite: companywebsite,
        companydetails: companydetails
      },
      function (data) {
        data = parseInt(data)
        if (data === 1) {
          $('#addcompanyreport')
            .removeClass('alert-danger')
            .addClass('alert alert-success')
            .html('Company added Successful.')
          setTimeout(loadCompany, 100)
        } else {
          $('#addcompanyreport')
            .removeClass('alert-success')
            .addClass('alert alert-danger')
            .html("Couldn't add company. Please try again...")
        }
      }
    )
  } else {
    $('#addcompanyreport')
      .removeClass('alert-success')
      .addClass('alert alert-danger')
      .html('All feilds are mandatory')
  }
}

function createDrive(id, name) {
  $('#driveidofcompany').val(id)
  $('#drivenameofcompany').val(name)
  $('#addDrive').modal('show')
}

function addDrive() {
  var driveidofcompany = $('#driveidofcompany').val()
  var jobpost = $('#jobpost').val()
  var jobdescription = $('#jobdescription').val()
  var departmentdrive = $('#departmentdrive').val()
  var temp = ''
  for (var i = 0; i < departmentdrive.length; i = i + 1) {
    temp += departmentdrive[i]
    if (i + 1 < departmentdrive.length) temp += ','
  }
  departmentdrive = temp
  var aggregatemark = $('#aggregatemark').val()
  var activebacklog = $('#activebacklog').prop('checked')
  var drivedate = $('#drivedate').val()
  var drivelocation = $('#drivelocation').val()
  var regdeadline = $('#regdeadline').val()

  $('#driveidofcompany').val()
  $('#jobpost').val()
  $('#jobdescription').val()
  $('#departmentdrive').val()
  $('#aggregatemark').val()
  $('#activebacklog').prop('checked')
  $('#drivedate').val()
  $('#drivelocation').val()
  $('#regdeadline').val()

  $('#adddrivereport')
    .addClass('alert')
    .prop('role', 'alert')
  if (
    jobpost.length === 0 ||
    jobdescription.length === 0 ||
    departmentdrive.length === 0 ||
    aggregatemark.length === 0 ||
    drivelocation.length === 0 ||
    drivedate.length === 0 ||
    regdeadline.length === 0
  ) {
    $('#adddrivereport')
      .removeClass('alert-success')
      .addClass('alert alert-danger')
      .html('All feilds are mandatory!')
  } else if (
    new Date(drivedate) < new Date() ||
    new Date(regdeadline) < new Date()
  ) {
    $('#adddrivereport')
      .removeClass('alert-success')
      .addClass('alert alert-danger')
      .html('Enter valid dates!')
  } else if (new Date(drivedate) < new Date(regdeadline)) {
    $('#adddrivereport')
      .removeClass('alert-success')
      .addClass('alert alert-danger')
      .html('Please check drive and registration dates!')
  } else {
    $.post(
      'functions.php', {
        adddrive: true,
        driveidofcompany: driveidofcompany,
        jobpost: jobpost,
        jobdescription: jobdescription,
        departmentdrive: departmentdrive,
        aggregatemark: aggregatemark,
        activebacklog: activebacklog,
        drivedate: drivedate,
        drivelocation: drivelocation,
        regdeadline: regdeadline
      },
      function (data) {
        var x = 1
        for (var i = 0; i < data.length; i++)
          if (data[i] === '0') x = 0
        if (x === 1) {
          $('#adddrivereport')
            .removeClass('alert-danger')
            .addClass('alert alert-success')
            .html('Drive added Successful.')
          setTimeout(loadCompany, 100)
        } else {
          $('#adddrivereport')
            .removeClass('alert-success')
            .addClass('alert alert-danger')
            .html("Couldn't add drive. Please try again...")
        }
      }
    )
  }
}

function loadCompany() {
  $('#addDrive').modal('hide')
  $.post(
    'functions.php', {
      getcompanies: true
    },
    function (data) {
      data = JSON.parse(data)
      var text = ''
      if (data !== null) {
        $.each(data, (index, element) => {
          text += '<div class="row"> <div class = "col-sm-10 card"><br/>'
          text += 'Name of the company : ' + element.name + '<br/>'
          text += 'Website of the company : ' + element.website + '<br/>'
          text += 'Details :<br/> ' + element.details
          text +=
            '<br/><br/></div><button class = "col-sm-2 btn btn-dark" onclick="createDrive(\'' +
            element.id +
            "','" +
            element.name +
            '\')">Create Drive</button></div><br/>'
        })
      }
      text +=
        '<div class="card card-body">' +
        '<div class = "form-group">' +
        '<label> Name of the company </label>' +
        '<input type = "text" class = "form-control" id = "nameofcompany" placeholder = "Enter name of company"></div>' +
        '<div class = "form-group">' +
        '<label> Website of the company </label>' +
        '<input type = "text" class = "form-control" id = "websiteofcompany" placeholder = "Enter website of company"></div>' +
        '<div class = "form-group" > ' +
        '<label> Details </label>' +
        '<textarea class = "form-control" id = "detailsofcompany" rows = "10" > </textarea> </div>' +
        '<div class = "form-group" id = "addcompanyreport" > </div>' +
        '<button type = "submit" class = "btn btn-dark" onclick = "addCompany()" >Add Company </button> </div > '
      $('#companiestab').html(text)
    }
  )
}

function loadPlaced() {
  $.post(
    'functions.php', {
      getstudents: true,
      placed: true
    },
    function (data) {
      data = JSON.parse(data)
      var text = ''
      if (data !== null) {
        $.each(data, (index, element) => {
          text += '<div class="row"> <div class = "col-sm-10 card"><br/>'
          text += 'Name : ' + element.fullname + '<br/>'
          text += 'USN : ' + element.usn + '<br/>'
          text += 'Department : ' + element.department + '<br/>'
          text += 'Aggregate : ' + element.aggregatemark + '<br/>'
          if (element.backlog === true) text += 'Active Backlog : Yes<br/>'
          else text += 'Active Backlog : No<br/>'
          text += '<br/></div><div class = "card col-sm-2")">'
          if (element.placed === 'false') {
            text += '<br/><br/>Not Placed<br/>'
          } else {
            text += '<br/><br/>' + element.placed
          }
          text += '</div></div><br/>'
        })
        $('#placedtab').html(text)
      }
    }
  )
}

function loadStudentDetails() {
  $.post(
    'functions.php', {
      getstudents: true,
      verified: true
    },
    function (data) {
      data = JSON.parse(data)
      var text = ''
      if (data !== null) {
        $.each(data, (index, element) => {
          element.verified = parseInt(element.verified)
          if (element.verified === 0) {
            text += '<div class="row"> <div class = "col-sm-10 card"><br/>'
            text += 'Name : ' + element.fullname + '<br/>'
            text += 'USN : ' + element.usn + '<br/>'
            text += 'Department : ' + element.department + '<br/>'
            text += 'Aggregate : ' + element.aggregatemark + '<br/>'
            if (element.backlog === true) text += 'Active Backlog : Yes<br/>'
            else text += 'Active Backlog : No<br/>'
            text +=
              '<br/></div><button class = "col-sm-2 btn btn-dark" onclick="verifyuser(\'' +
              element.uid +
              '\')">Verify</button></div><br/>'
          } else {
            text += '<div class="row"> <div class = "col-sm-12 card"><br/>'
            text += 'Name : ' + element.fullname + '<br/>'
            text += 'USN : ' + element.usn + '<br/>'
            text += 'Department : ' + element.department + '<br/>'
            text += 'Aggregate : ' + element.aggregatemark + '<br/>'
            if (element.backlog === true) text += 'Active Backlog : Yes<br/>'
            else text += 'Active Backlog : No<br/>'
            text += '<br/></div></div><br/>'
          }
        })
        $('#studentdetailstab').html(text)
      }
    }
  )
}

function loadDrive() {
  var x
  $.post(
    'functions.php', {
      getapplied: true
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
          if (x !== null) {
            $.each(x, (index, subelement) => {
              if (parseInt(element.deptid) === parseInt(subelement.did)) {
                text += '<div class="row"><div class = "col-sm-10 card"><br/>'
                text += 'Name of the student : ' + subelement.username + '<br/>'
                text += '</div>'
                if (subelement.placed === 'false') {
                  text += '<button class = "col-sm-2 btn btn-dark" onclick="setplaced(\'' +
                    element.name + "','" + subelement.uid + '\')">Placed</button>'
                }
                text += '</div><br/>'
              }
            })
          }
          text += '</div></div><br/>'
        })
      }
      $('#drivestab').html(text)
    }
  )
}

function setplaced(companyname, uid) {
  $.post(
    'functions.php', {
      setplaced: true,
      companyname: companyname,
      uid: uid
    },
    function (data) {
      // data = parseInt(data)
      console.log(data)
      if (data === 0)
        alert('Unsuccessful')
      else
        alert('Successful')
    }
  )
}

$(document).ready(function () {
  if ($.cookie('uid') === undefined || $.cookie('uid') !== 'placement') {
    $(location).attr('href', 'index.html')
  }
  loadCompany()
})

function signOut() {
  $.removeCookie('uid', {
    path: '/'
  })
  $(location).attr('href', 'index.html')
}