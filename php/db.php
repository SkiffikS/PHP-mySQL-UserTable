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

function checkForSqlInjection($value) {
  // Remove any whitespace from the beginning and end of the input
  $value = trim($value);

  // Check if the input contains any SQL keywords
  $sqlKeywords = array('select', 'insert', 'update', 'delete', 'alter', 'drop', 'create', 'truncate', 'grant', 'revoke', 'rename', 'replace', 'load', 'outfile', 'dumpfile', 'into', 'procedure', 'function', 'execute', 'declare', 'prepare', 'commit', 'rollback', 'savepoint', 'begin', 'set', 'show');
  foreach ($sqlKeywords as $keyword) {
    if (stripos($value, $keyword) !== false) {
      return false;
    }
  }

  // Check if the input contains any SQL operators
  $sqlOperators = array('=', '<>', '!=', '>', '<', '>=', '<=', '<=>', 'like', 'regexp', 'in', 'between', 'is', 'not');
  foreach ($sqlOperators as $operator) {
    if (stripos($value, $operator) !== false) {
      return false;
    }
  }

  // Check if the input contains any SQL functions
  $sqlFunctions = array('count', 'sum', 'avg', 'min', 'max', 'concat', 'substring', 'substr', 'length', 'char_length', 'trim', 'ltrim', 'rtrim', 'lower', 'upper', 'date_format', 'now', 'curdate', 'curtime', 'year', 'month', 'day', 'hour', 'minute', 'second', 'ifnull', 'coalesce', 'cast', 'convert', 'group_concat', 'having', 'distinct', 'union', 'case', 'when', 'then', 'else', 'end');
  foreach ($sqlFunctions as $function) {
    if (stripos($value, $function) !== false) {
      return false;
    }
  }

  // Check if the input contains any special characters that may be used in SQL injection attacks
  $specialChars = array(';', '--', '/*', '*/', '#', 'admin', 'passwd', 'char(', 'ascii(', 'mid(', 'hex(', 'substring(', 'substr(', 'concat(', 'union(', 'load_file(');
  foreach ($specialChars as $char) {
    if (stripos($value, $char) !== false) {
      return false;
    }
  }

  // If none of the checks have failed, return true
  return true;
}