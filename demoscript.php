<?php
/**
 * Dummy script for testing lateLoad.
 * 
 * TO USE:
 *     <script src='/path/to/demoscript.php?
 *         sleep= how many seconds to wait before returning this script. Default=4
 *         into=  id of the div to put the text into.
 *         text=  the text to put into the div.
 * 
 * @author jls
 * 
 * @version 1.0  2012-05-04 
 */
header ('Content-type: text/javascript');

$nSecs   = $_GET['sleep'] ? (int) $_GET['sleep'] : 4;
$htmInto = $_GET['into']  ? htmlentities($_GET['into'], ENT_QUOTES) : '(unknown)';
$htmText = $_GET['text']  ? htmlentities($_GET['text'], ENT_QUOTES) : "This script took {$nSecs} seconds to load.";

sleep($nSecs);

print "
domContainer = document.getElementById('{$htmInto}');
domContainer.innerHTML = '{$htmText}';

g.logEvent ('***Loaded the {$htmInto} script');
";

?>
