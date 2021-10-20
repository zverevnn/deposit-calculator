<?php

    $date = $_POST['date'];
    $year = date("Y", strtotime($date));
    $month = date("m", strtotime($date));
    $years = $_POST['years'];
    $summn = $_POST['summn'];
    $summadd = $_POST['summadd'];
    $daysn  = cal_days_in_month(CAL_GREGORIAN, $month, $year);
    $percent  = 0.1;
    $daysy = 365;

    if ( ( $year % 4 == 0 && ( $year % 100 != 0 || $year % 400 == 0 ) ) ) {
        $daysy = 366;
    }
    
    $summnLastMonth = $summn;
    
    for ($i = 2; $i <= $years * 12; $i++) {
        
        // формула расчета капитализации % по вкладу понятна не полностью
        $summn = $summnLastMonth + ($summnLastMonth + $summadd) * $daysn * ($percent / $daysy);
        $summnLastMonth = $summn;
    }
    


    echo round($summn, 0)
   
?>