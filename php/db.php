<?php

// connect to database file (for fast correct $servername)

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "sst3";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}