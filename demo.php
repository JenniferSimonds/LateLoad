<?php
/**
 * Demo page for lateLoad.
 * 
 * TO USE:
 *     demo.php?
 *         jquery=[1]  Whether to load jQuery.
 * 
 * @author jls
 * 
 * @version 1.0  2012-05-04 
 */

class g
{
	static $isJQuery = false;
}

g::$isJQuery = !empty($_GET['jquery']);

print "
<html>
<head>

<style>
H3 {
	margin-bottom: 4px;
	font-family: Verdana, Arial;
	font-size: 15px;
}

.test-container {
	border: 1px solid #aaaaaa;
	width: 300px;
	height: 40px;
}

#loadsInline {
	border-color: pink;
}
#loadsOnDocumentReady {
	border-color: lightblue;
}
#loadsOnLoad {
	border-color: yellow;
}
#loadsOnButton {
	border-color: lightgreen;
}


#logWindow {
	margin-top: 8px;
	border: 1px solid blue;
	height: 300px;
	width: 450px;
	font-family: Verdana, Arial;
	font-size: 13px;
	overflow: auto;
}

.log-entry {
	padding: 2px 4px;
	border-bottom: 1px solid #eeeeee;
}

.time {
	display: inline-block;
	margin-right: 8px;
	width: 60px;
	font-family: Courier, monospace;
	text-align: right;
	vertical-align: top;
}

.descr {
	display: inline-block;
	width: 360px;
	text-align: left;
}

</style>

<script>
g = {};
g.dtStart = new Date();
</script>

";

if (g::$isJQuery)
{
	print "
<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js'></script>
";
}

print "
<script type='text/javascript' src='/projects/lateload/lateload.beta.1.js'></script>

<script>
";

if (g::$isJQuery)
{
	print "
$(document).ready(function(){
	g.logEvent ('$(document).ready in &lt;HEAD>');
});
";
}

print <<< xxxxx

g.onLoad = function ()
{
	g.logEvent ('onload');
}


g.loadManual = function ()
{
	g.logEvent ('Calling lateLoad.now("MyTest")...');
	lateLoad.now ('MyTest');
	g.logEvent ('...lateLoad.now returned');
}


g.logEvent = function (p_msg)
{
	var dtNow, msecs, secs, domLogEntry;
	
	dtNow = new Date();
	msecs = dtNow.getTime() - g.dtStart.getTime();
	secs  = (msecs / 1000).toFixed(3);
	
	domLogEntry = document.createElement('DIV');
	domLogEntry.className = "log-entry";
	domLogEntry.innerHTML = "<div class='time'>" + secs + "</div><div class='descr'>" + p_msg + "</div>";
	g.domLog.appendChild (domLogEntry);
}
</script>

</head>

<body onload='g.onLoad()'>

xxxxx;

if (g::$isJQuery)
{
	print "
<script>
$(document).ready(function(){
	g.logEvent ('$(document).ready at start of &lt;BODY>');
});
</script>
";
}

print "
<div id='logWindow'>
</div>

<script>
g.domLog = document.getElementById('logWindow');
</script>


<p>It is interesting to contemplate an entangled bank, clothed with many plants of many kinds, with birds singing on the bushes, with various insects flitting about, and with worms crawling through the damp earth, and to reflect that these elaborately constructed forms, so different from each other, and dependent on each other in so complex a manner, have all been produced by laws acting around us. 


<h3>This script is loaded inline, so it blocks the text below it.</h3>

<div id='loadsInline' class='test-container'>
</div>
<script type='text/javascript' src='demoscript.php?into=loadsInline'></script>

<p>These laws, taken in the largest sense, being Growth with Reproduction; inheritance which is almost implied by reproduction; Variability from the indirect and direct action of the external conditions of life, and from use and disuse; a Ratio of Increase so high as to lead to a Struggle for Life, and as a consequence to Natural Selection, entailing Divergence of Character and the Extinction of less-improved forms.  

";

if (g::$isJQuery)
{
	print "
<h3>This script won't load until $(document).ready</h3>

<div id='loadsOnDocumentReady' class='test-container'>
</div>
<script>
lateLoad.later ('demoscript.php?into=loadsOnDocumentReady', {when:'onDocumentReady', where:'#loadsOnDocumentReady'});
</script>
";
}

print "
<p>Thus, from the war of nature, from famine and death, the most exalted object which we are capable of conceiving, namely, the production of the higher animals, directly follows.


<h3>This script won't load until window.onload</h3>

<div id='loadsOnLoad' class='test-container'>
</div>
<script>
lateLoad.later ('demoscript.php?into=loadsOnLoad', {when:'onLoad', where:'#loadsOnLoad'});
</script>

<p>There is grandeur in this view of life, with its several powers, having been originally breathed into a few forms or into one; and that, whilst this planet has gone cycling on according to the fixed law of gravity, from so simple a beginning endless forms most beautiful and most wonderful have been, and are being, evolved.


<h3>This script won't load until you press this button:</h3>

<input type='button' value='Load MyTest widget' onclick='g.loadManual()'>
<div id='loadsOnButton' class='test-container'>
</div>
<script>
lateLoad.later ('demoscript.php?into=loadsOnButton', {when:'MyTest', where:'#loadsOnButton'});
</script>

";

if (g::$isJQuery)
{
	print <<< xxxxx
<script>
$(document).ready(function(){
	g.logEvent ('$(document).ready at end of &lt;BODY>');
});
</script>
xxxxx;
}

print "
</body>
";

if (g::$isJQuery)
{
	print "
<script>
$(document).ready(function(){
	g.logEvent ('$(document).ready after &lt;/BODY>');
});
</script>
";
}

print "
<script>
g.logEvent ('Parsing end of document');
</script>

</html>
";
