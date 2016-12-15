<?php
$db = new mysqli('localhost', 'root', '', 'vimaxgrc_autokey2016');
$db->set_charset("utf8");
if ($db->connect_errno) {
    die('Cannot connect to database');
}

//$emsQuery = "SELECT"

    function bulPostQuery($geo_zone){
        $query = "select s.value from oc_setting as s 
         where s.`key` = \"b_surereach_geo_weight_".$geo_zone."_rate\"";
        return $query;
    }
function emsQuery($geo_zone){
    $query = "select s.value from oc_setting as s 
         where s.`key` = \"b_ems_geo_weight_".$geo_zone."_rate\"";
    return $query;
}
function dhlQuery($geo_zone){
    $query = "select s.value from oc_setting as s 
         where s.`key` = \"b_dhl_geo_weight_".$geo_zone."_rate\"";
    return $query;
}
function dhlRoadQuery($geo_zone){
    $query = "select s.value from oc_setting as s 
         where s.`key` = \"b_tqbin_geo_weight_".$geo_zone."_rate\"";
    return $query;
}
    $data = array();
function getEms($db,$data){
    $zone =1;
    for ( $i = 41;$i<=47;$i++){

       $result = $db->query(emsQuery($i));

        while ($row = $result->fetch_assoc()) {
         $data["zone".$zone."-EMS-".$i]=explode(",",$row[value]) ;
            $zone++;
        }
    }
echo json_encode($data);
}
function getBulPost($db,$data){
    $zone =1;
    for ( $i = 34;$i<=39;$i++){

        $result = $db->query(bulPostQuery($i));

        while ($row = $result->fetch_assoc()) {
            $data["zone".$zone."-BulPosts-".$i]=explode(",",$row[value]) ;
            $zone++;
        }
    }
    echo json_encode($data);
}

function getDHL($db,$data){
    $zone =1;
    for ( $i = 13;$i<=17;$i++){

        $result = $db->query(dhlQuery($i));

        while ($row = $result->fetch_assoc()) {
            $data["zone".$zone."-DHL-".$i]=explode(",",$row[value]) ;
            $zone++;
        }
    }
    $result = $db->query(dhlQuery(21));
    while ($row = $result->fetch_assoc()) {
        $data["zone6"."-DHL-21"]=explode(",",$row[value]) ;

    }
    $result = $db->query(dhlQuery(18));
    while ($row = $result->fetch_assoc()) {
        $data["zone7"."-DHL-18"]=explode(",",$row[value]) ;
    }
    $result = $db->query(dhlQuery(19));
    while ($row = $result->fetch_assoc()) {
        $data["zone8"."-DHL-19"]=explode(",",$row[value]) ;
    }

    echo json_encode($data);
}
function getDHLRoad($db,$data){
    $zone =1;
    for ( $i = 22;$i<=26;$i++){

        $result = $db->query(dhlRoadQuery($i));

        while ($row = $result->fetch_assoc()) {
            $data["zone".$zone."-DHLRoad-".$i]=explode(",",$row[value]) ;
            $zone++;
        }
    }


    echo json_encode($data);
}

if(isset($_GET['shipping'])){
    $shipping = $_GET['shipping'];
    switch ($shipping){
        case "EMS": getEms($db,$data);
            break;
        case "DHL": getDHL($db,$data);
            break;
        case "BulPost": getBulPost($db,$data);
            break;
        case "DHLRoad": getDHLRoad($db,$data);
            break;

    }


}
if(isset($_GET['updated'])){
    $updated = $_GET['updated'];
    $method = $_GET['method'];
    $geoZoneId = $_GET['geoZone'];
    updateDB($method,$geoZoneId,$updated,$db);

}


function updateDB($method,$geoZone,$updated,$db){
    $prefix="";
    $sufix="_rate\"";
    $updated = "\"".$updated."\"";

    switch ($method){
        case "DHL":$prefix="\"b_dhl_geo_weight_";
            break;
        case "EMS":$prefix="\"b_ems_geo_weight_";
            break;
        case "BulPosts":$prefix="\"b_surereach_geo_weight_";
            break;
        case "DHLRoad":$prefix="\"b_tqbin_geo_weight_";
            break;
    }

    $key = $prefix.$geoZone.$sufix;
    $query = "UPDATE `oc_setting` set `value`=".$updated." WHERE `key` =".$key;
    var_dump($query);
  $db->query($query);
   echo $db->affected_rows;
}