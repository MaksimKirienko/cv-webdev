<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$action = $data['action'];

if (!$data['token'] || ($data['token'] != 'nW;u!SqW!V6GLF&p')) {
  echo 'authorization token required';
  exit(0);
}

if (!$action) {
  echo 'specify action';
  exit(0);
}

if (isset($data['levelName']) && !preg_match('/^[a-zA-Z0-9_-]+$/', $data['levelName'])) {
  echo 'error: wrong level name';
  exit(0);
}
if (isset($data['newLevelName']) && !preg_match('/^[a-zA-Z0-9_-]+$/', $data['newLevelName'])) {
  echo 'error: wrong new level name';
  exit(0);
}



function returnData($rez = []) {
  $rez['status'] = 'ok';
  echo json_encode($rez);
  exit(0);
}

if ($action == 'getLevels') {
  $files = glob("./levels/*.json");

  $levelNames = [];

  foreach ($files as $key => $path) {
    preg_match('/.*\/level\-(.*)\.json/', $path, $match);
    $levelNames[] = $match[1];
  }

  // natsort($levelNames);
  sort($levelNames, SORT_NUMERIC);

  returnData([
    'levelsList' => $levelNames
  ]);
}

// now saveLevel used for creation
// if ($action == 'addLevel') {
//   file_put_contents("./levels/level-new.json", "{\n}\n");
//   returnData();
// }

if ($action == 'removeLevel') {
  unlink("./levels/level-".$data['levelName'].".json");
  returnData();
}

if ($action == 'loadLevel') {
  $levelData = file_get_contents("./levels/level-".$data['levelName'].".json");
  returnData([ 'levelData' => $levelData ]);
}

if ($action == 'renameLevel') {
  $res = rename(
    "./levels/level-".$data['levelName'].".json",
    "./levels/level-".$data['newLevelName'].".json"
  );

  if ($res) {
    returnData();
  } else {
    echo 'error: no file found with name '.$data['levelName'];
    exit(0);
  }
}

if ($action == 'saveLevel') {
  file_put_contents("./levels/level-".$data['levelName'].".json", $data['levelData']);
  returnData();
}

if ($action == 'getBackgroundList') {
  $files = glob("../../assets/i/match/bg/*-big.jpg");

  $backgroundList = [];

  foreach ($files as $key => $path) {
    preg_match('/.*\/(.*?)\-big\.jpg/', $path, $match);
    $backgroundList[] = $match[1];
  }

  // svg
  $files = glob("../../assets/i/match/bg/*.svg");
  foreach ($files as $key => $path) {
    preg_match('/.*\/(.*)/', $path, $match);
    $backgroundList[] = $match[1];
  }

  returnData([
    'backgroundList' => $backgroundList
  ]);
}

if ($action == 'getItemsData') {
  $itemsData = file_get_contents("../data/items.json");
  returnData([ 'itemsData' => $itemsData ]);
}

echo 'error: action not exists';
