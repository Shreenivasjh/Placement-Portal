// Executes when Sign In tab is pressed
function signIntabfun() {
  $('#signUptab').css('display', 'none')
  $('#signIntab').css('display', 'block')
  $('#signInButton').addClass(' active')
  $('#signUpButton').removeClass(' active')
}

// Executes when Sign Up tab is pressed
function signUptabfun() {
  $('#signIntab').css('display', 'none')
  $('#signUptab').css('display', 'block')
  $('#signInButton').removeClass(' active')
  $('#signUpButton').addClass(' active')
}

function signupusernamecheck() {
  var username = $('#signupusernamefield').val()
  $('#signupusernamecheckreport').addClass('alert').prop('role', 'alert')
  if (username.match('^[A-z0-9]+$') && username.length >= 8) {
    $.post(
      'functions.php', {
        checkavail: 'true',
        username: username
      },
      function (data) {
        data = parseInt(data)
        if (data === 1) {
          $('#signupusernamecheckreport')
            .removeClass('alert-success')
            .addClass('alert-danger')
            .html('UserID is unavailable...')
        } else {
          $('#signupusernamecheckreport')
            .removeClass('alert-danger')
            .addClass('alert-success')
            .html('UserID is available...')
        }
      }
    )
  } else {
    if (username.length === 0) {
      $('#signupusernamecheckreport')
        .removeClass('alert-success')
        .addClass('alert-danger')
        .html('Username is mandatory.')
    } else if (!username.match('^[A-z0-9]+$')) {
      $('#signupusernamecheckreport')
        .removeClass('alert-success')
        .addClass('alert-danger')
        .html('Username can contain only alphabets and numbers')
    } else {
      $('#signupusernamecheckreport')
        .removeClass('alert-success')
        .addClass('alert-danger')
        .html('Username should be atleast 8 characters')
    }
  }
}

function signuppasswordcheck() {
  var password = $('#signuppasswordfield').val()
  $('#signuppasswordcheckreport').addClass('alert').prop('role', 'alert')
  if (password.length < 8) {
    $('#signuppasswordcheckreport')
      .removeClass('alert-success')
      .addClass('alert-danger')
      .html('Password is mandatory!')
  } else if (password.length < 8) {
    $('#signuppasswordcheckreport')
      .removeClass('alert-success')
      .addClass('alert-danger')
      .html('Password should be atleast 8 characters')
  } else {
    $('#signuppasswordcheckreport')
      .removeClass('alert-danger')
      .addClass('alert-success')
      .html('Password is okay!')
  }
}

function signuprepasswordcheck() {
  var password = $('#signuppasswordfield').val()
  var repassword = $('#signuprepasswordfield').val()
  $('#signuprepasswordcheckreport').addClass('alert').prop('role', 'alert')
  if (password !== repassword || password.length < 8) {
    $('#signuprepasswordcheckreport')
      .removeClass('alert-success')
      .addClass('alert-danger')
      .html("Password don't match!")
  } else {
    $('#signuprepasswordcheckreport')
      .removeClass('alert-danger')
      .addClass('alert-success')
      .html('Password matches!')
  }
}

function signUp() {
  var username = $('#signupusernamefield').val()
  var password = $('#signuppasswordfield').val()
  var repassword = $('#signuprepasswordfield').val()
  signupusernamecheck()
  signuppasswordcheck()
  signuprepasswordcheck()
  $('#signupreport').addClass('alert').prop('role', 'alert')

  if (
    !$('#signupusernamecheckreport').hasClass('alert-danger') &&
    !$('#signuppasswordcheckreport').hasClass('alert-danger') &&
    !$('#signuprepasswordcheckreport').hasClass('alert-danger') &&
    password.length >= 8 &&
    password === repassword &&
    username.length >= 8
  ) {
    $('#signupusernamefield').val('')
    $('#signupusernamecheckreport').alert('close')
    $('#signuppasswordfield').val('')
    $('#signuppasswordcheckreport').alert('close')
    $('#signuprepasswordfield').val('')
    $('#signuprepasswordcheckreport').alert('close')
    $.post(
      'functions.php', {
        signupsubmit: true,
        username: username,
        passwd: password
      },
      function (data) {
        data = parseInt(data)
        if (data === 1) {
          $('#signupreport')
            .removeClass('alert-danger')
            .addClass('alert alert-success')
            .html('Sign Up Successful. Redirecting for Sign In...')
        } else {
          $('#signupreport')
            .removeClass('alert-success')
            .addClass('alert alert-danger')
            .html('Sign Up Unsuccessful. Please try again...')
        }

        if ($('#signupreport').hasClass('alert-success')) {
          setTimeout(signIntabfun, 1000)
        }
      }
    )
  } else {
    $('#signupreport')
      .removeClass('alert-success')
      .addClass('alert-danger')
      .html('All fields are mandatory!')
  }
}

function signIn() {
  var username = $('#signInusername').val()
  var password = $('#signInpassword').val()
  $('#signinreport').addClass('alert').prop('role', 'alert')
  if (password.length >= 8 && username.length >= 8) {
    $('#signInusername').val('')
    $('#signInpassword').val('')
    $.post(
      'functions.php', {
        signinsubmit: true,
        username: username,
        passwd: password
      },
      function (data) {
        data = parseInt(data)
        if (data === 0) {
          $('#signinreport')
            .removeClass('alert-success')
            .addClass('alert-danger')
            .html("Credential didn't match")
        } else {
          $('#signinreport')
            .removeClass('alert-danger')
            .addClass('alert-success')
            .html('Success!!!')
          $.cookie('uid', username, {
            path: "/",
            expires: 10
          })
          if (username === 'placement') {
            setTimeout(function () {
              $(location).attr('href', 'placement.html')
            }, 100)
          } else {
            setTimeout(function () {
              $(location).attr('href', 'loggedin.html')
            }, 100)
          }

        }
      }
    )
  } else {
    $('#signinreport')
      .removeClass('alert-success')
      .addClass('alert-danger')
      .html('Please check all the fields!')
  }
}

$(document).ready(function () {
  if ($.cookie('uid') !== undefined) {
    var username = $.cookie('uid');
    $('#signinreport')
      .prop('role', 'alert')
      .addClass('alert alert-success')
      .html('Logging In...')
    if (username === 'placement') {
      setTimeout(function () {
        $(location).attr('href', 'placement.html')
      }, 1000)
    } else {
      setTimeout(function () {
        $(location).attr('href', 'loggedin.html')
      }, 1000)
    }
  }
})