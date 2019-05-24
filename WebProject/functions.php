<?php
$db = mysqli_connect("localhost", "root", "", "");
if (!$db) {
    die('Could not connect to database : ' . mysqli_error($db));
}
$query = 'CREATE DATABASE IF NOT EXISTS `placement`;';
$result = mysqli_query($db, $query);
$query = 'USE `placement`;';
$result = mysqli_query($db, $query);
$query = 'CREATE TABLE IF NOT EXISTS `users` (uid varchar(20) PRIMARY KEY, password varchar(20) NOT NULL, verified int(11) NOT NULL);';
$result = mysqli_query($db, $query);
$query = 'CREATE TABLE IF NOT EXISTS `userdetails` (uid varchar(20) PRIMARY KEY, fullname varchar(20), usn varchar(10), department varchar(5), aggregatemark int(11), backlog varchar(10), placed varchar(20), FOREIGN KEY (uid) REFERENCES users(uid));';
$result = mysqli_query($db, $query);
$query = 'CREATE TABLE IF NOT EXISTS `companydetails` (id int(11) AUTO_INCREMENT PRIMARY KEY, name varchar(20), website varchar(20), details varchar(100));';
$result = mysqli_query($db, $query);
$query = 'CREATE TABLE IF NOT EXISTS `drivedetails` (id int(11) AUTO_INCREMENT PRIMARY KEY, compid int(11), jobpost varchar(20), jobdescription varchar(100),  department varchar(20), aggregatemark int(11), backlog varchar(10), reg_lastdate date, drive_date date, drivelocation varchar(20),FOREIGN KEY (compid) REFERENCES companydetails(id));';
$result = mysqli_query($db, $query);
$query = 'CREATE TABLE IF NOT EXISTS `applied` (aid int(11) AUTO_INCREMENT PRIMARY KEY, did int(11),uid varchar(20), username varchar(20),FOREIGN KEY (did) REFERENCES drivedetails(id));';
$result = mysqli_query($db, $query);


if (isset($_POST['checkavail'])) {
    $uid = htmlspecialchars($_POST['username']);
    $query = 'SELECT * FROM `users` WHERE uid = "' . $uid . '"';
    $result = mysqli_query($db, $query);
    echo mysqli_num_rows($result);
} else if (isset($_POST['signupsubmit'])) {
    $uid = htmlspecialchars($_POST['username']);
    $passwd = htmlspecialchars($_POST['passwd']);
    $query = 'INSERT INTO `users` VALUES ("' . $uid . '","' . $passwd . '","false");';
    $result = mysqli_query($db, $query);
    print($result);
} else if (isset($_POST['signinsubmit'])) {
    $uid = htmlspecialchars($_POST['username']);
    $passwd = htmlspecialchars($_POST['passwd']);
    $query = 'SELECT * FROM `users` WHERE uid = "' . $uid . '" AND  password = "' . $passwd . '"';
    $result = mysqli_query($db, $query);
    echo mysqli_num_rows($result);
} else if(isset($_POST['verifieduser'])){
    $uid = htmlspecialchars($_POST['username']);
    $query = 'SELECT verified FROM `users` WHERE uid = "' . $uid . '"';
    $result = mysqli_query($db, $query);
    if(mysqli_num_rows($result)!=0){
        echo mysqli_fetch_assoc($result)['verified'];
    }else{
        print("-1");
    }
} else if(isset($_POST['setuserdetails'])){
    $uid = $_POST['uid'];
    $fullname = $_POST['fullname'];
    $usn = $_POST['usn'];
    $department = $_POST['department'];
    $aggregate = $_POST['aggregatemark'];
    $backlog = $_POST['backlog'];
    $query = "DELETE FROM `userdetails` WHERE `uid` = '".$uid."';";
    $result = mysqli_query($db, $query);
    $query = "INSERT INTO `userdetails`(`uid`, `fullname`, `usn`, `department`, `aggregatemark`, `backlog`, `placed`) VALUES ('".$uid."','".$fullname."','".$usn."','".$department."','".$aggregate."','".$backlog."','false');";
    $result = mysqli_query($db, $query);
    print($result);
}  else if(isset($_POST['getuserdetails'])){
    $uid = $_POST['uid'];
    $query = "SELECT * FROM `userdetails` WHERE `uid` = '".$uid."';";
    $result = mysqli_query($db, $query);
    echo json_encode(mysqli_fetch_assoc($result));
}  else if(isset($_POST['getstudents'])){
    $query = "SELECT ud.`uid`, ud.`fullname`, ud.`usn`, ud.`department`, ud.`aggregatemark`, ud.`backlog`, ud.`placed`, u.`verified` FROM `userdetails` ud,`users` u WHERE ud.`uid` = u.`uid` ORDER BY ";
    if(isset($_POST['verified']))
        $query = $query."u.`verified`;";
    else if(isset($_POST['placed']))
        $query = $query."ud.`placed`;";
    $result = mysqli_query($db, $query);
    $array = [];
    while($temp = mysqli_fetch_assoc($result))
        $array[] = $temp;
    echo json_encode($array);
}  else if(isset($_POST['verifyuser'])){
    $uid = $_POST['username'];
    $query = "UPDATE `users` SET `verified` = '1' WHERE `uid` = '".$uid."';";
    $result = mysqli_query($db, $query);
    echo $result;
}  else if(isset($_POST['getcompanies'])){
    $query = "SELECT `id`,`name`, `website`, `details` FROM `companydetails`;";
    $result = mysqli_query($db, $query);
    $array = [];
    while($temp = mysqli_fetch_assoc($result))
        $array[] = $temp;
    echo json_encode($array);
} else if(isset($_POST['addcompany'])){
    $companyname = $_POST['companyname'];
    $companywebsite = $_POST['companywebsite'];
    $companydetails = $_POST['companydetails'];
    $query = "INSERT INTO `companydetails`(`name`, `website`, `details`) VALUES ('".$companyname."','".$companywebsite."','".$companydetails."');";
    $result = mysqli_query($db, $query);
    print($result);
}  else if(isset($_POST['getdrives'])){
    $query = "SELECT dd.`id` as deptid,cd.`id`, `name`, `website`, `details`,`compid`, `jobpost`, `jobdescription`, `department`, `aggregatemark`, `backlog`, `reg_lastdate`, `drive_date`, `drivelocation` FROM `companydetails` cd,`drivedetails` dd WHERE compid = cd.id GROUP BY dd.id";
    $result = mysqli_query($db, $query);
    $array = [];
    while($temp = mysqli_fetch_assoc($result))
        $array[] = $temp;
    echo json_encode($array);
} else if(isset($_POST['getapplied'])){
    $query = "SELECT a.`did`, a.`uid`, a.`username`,u.`placed` FROM `applied` a,`userdetails` u WHERE a.`uid`=u.`uid` ";
    if(isset($_POST['uid']))
        $query.=" AND u.`uid`='".$_POST['uid']."'";
    $query.="GROUP BY a.`uid`;";
    $result = mysqli_query($db, $query);
    $array = [];
    while($temp = mysqli_fetch_assoc($result))
        $array[] = $temp;
    echo json_encode($array);
} else if(isset($_POST['adddrive'])){
    $driveidofcompany = $_POST['driveidofcompany'];
    $jobpost = $_POST['jobpost'];
    $jobdescription = $_POST['jobdescription'];
    $departmentdrive = $_POST['departmentdrive'];
    $aggregatemark = $_POST['aggregatemark'];
    $activebacklog = $_POST['activebacklog'];
    $drivedate = $_POST['drivedate'];
    $drivelocation = $_POST['drivelocation'];
    $regdeadline = $_POST['regdeadline'];
    $query = "INSERT INTO `drivedetails`
    (`compid`, `jobpost`, `jobdescription`, `department`, `aggregatemark`, `backlog`, `reg_lastdate`, `drive_date`, `drivelocation`) VALUES 
    ('".$driveidofcompany."','".$jobpost."','".$jobdescription."','".$departmentdrive."','".$aggregatemark."'
    ,'".$activebacklog."','".$regdeadline."','".$drivedate."','".$drivelocation."');";
    $result = mysqli_query($db, $query);
    print($result);
} else if(isset($_POST['applydrive'])){
    $uid=$_POST['uid'];
    $did=$_POST['did'];
    $name=$_POST['name'];
    $query = "INSERT INTO `applied`(`did`, `uid`, `username`) VALUES ('".$did."','".$uid."','".$name."');";
    $result = mysqli_query($db, $query);
    print($result);
} else if(isset($_POST['historydrive'])){
    $uid=$_POST['uid'];
    $query = "SELECT d.`id`, `compid`,`name`, `jobpost`, `jobdescription`, `department`, `aggregatemark`, `backlog`, `reg_lastdate`, `drive_date`, `drivelocation` FROM `drivedetails` d,`companydetails`c  WHERE c.id = d.compid AND d.`id` IN (SELECT `did` FROM `applied` WHERE `uid`='".$uid."');";
    $result = mysqli_query($db, $query);
    $array = [];
    while($temp = mysqli_fetch_assoc($result))
        $array[] = $temp;
    echo json_encode($array);
} else if(isset($_POST['setplaced'])){
    $uid=$_POST['uid'];
    $companyname = $_POST['companyname'];
    $query = "UPDATE `userdetails` SET `placed`='".$companyname."' WHERE `uid`='".$uid."';";
    $result = mysqli_query($db, $query);
    echo $result;
} 

mysqli_close($db);
?>