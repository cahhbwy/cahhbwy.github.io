<?php
/**
 * Created by PhpStorm.
 * User: monk
 * Date: 2018-07-19 019
 * Time: 19:25
 */
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["context"])) {
        $content = json_decode($_POST["context"]);
        $ID = isset($_POST["ID"]) ? $_POST["ID"] : "000000000";
        echo file_put_contents("output/$ID.jpg", base64_decode($_POST['data']));
    }
}