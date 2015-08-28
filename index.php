<html lang="en">
<head>
	<meta charset="utf-8">
	<title>MarkovComposer (on the web)</title>
	<script type="text/javascript" src="js/Queue.js"></script>
	<script type="text/javascript" src="js/jquery-2.1.4.min.js"></script>
	<script type="text/javascript" src="js/base64-binary.js"></script>
	<script src="js/sigma.min.js"></script>
	<script type="text/javascript" src="js/MIDI.min.js"></script>
	<script type="text/javascript" src="js/app.js"></script>

	<link rel="stylesheet" type="text/css" href="css/main.css">
	<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
</head>
<body>
	<div id="header">
		<a role="button" class="player-button fa-refresh fa" id="refresh"></a>
		<a role="button" class="player-button fa-play fa" id="play"></a>
		<div class="composition">
			Composition: <span class="name">none</span>
		</div>
		<div class="learned">
			Learned from <span class="name">786</span> compositions.
		</div>
	</div>
	<div id="main"></div>
	<div id="footer">
		<div class="info">
			<div class="share">
				<a title="Share on Twitter!" href="https://twitter.com/intent/tweet?hashtags=MarkovComposer&amp;text=Try your luck with algorithmic composition! Who knows what results you can get.&amp;url=http%3A%2F%2Fmarkov.zx.rs%2F" onclick="javascript:window.open(this.href,
                '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;"><span class="fa fa-twitter"></span></a>&nbsp;
				<a title="Share on Facebook!" href="https://www.facebook.com/sharer/sharer.php?app_id=1458943427691030&amp;sdk=joey&amp;u=http%3A%2F%2Fmarkov.zx.rs%2F&amp;display=popup" onclick="javascript:window.open(this.href,
                '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;"><span class="fa fa-facebook-square"></span></a>&nbsp;
				<a title="Share on Google+!" href="https://plus.google.com/share?url=http%3A%2F%2Fmarkov.zx.rs%2F" onclick="javascript:window.open(this.href,
                '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;"><span class="fa fa-google-plus-square"></span></a>&nbsp;
				<a title="Check out the source on github!" href="https://github.com/anbud/MarkovComposer" target="_blank"><span class="fa fa-github"></span></a>
			</div>
			Made with <span class="fa-heart fa" style="color: #c40169"></span> by <a target="_blank" href="http://zx.rs/">zx</a>!
		</div>
		<div class="status">
			Loading<span class="highlight">...</span>
		</div>
	</div>
</body>
</html>