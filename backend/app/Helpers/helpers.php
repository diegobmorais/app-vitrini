<?php 

if (!function_exists('dbug')) {
    function dbug($data)
    {    
        response()->json($data)->send();
        exit;
    }
}