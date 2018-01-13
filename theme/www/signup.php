<?php include_once($_SERVER["LOCAL_PATH"]."/includes/segment.php") ?>
<!DOCTYPE html>
<html lang="DA">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
	<!-- (c) & (p) animated.dk 2017 -->
	<!-- (c) & (p) think.dk 2002-2017 -->
	<title>Stofa - Valget er dit</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="keywords" content="" />
	<meta name="description" content="Valget er Dit! Danmarks bedste quiz fra Stofa er tilbage. Test din viden igennem 4 uger og vind fede præmier" />
	<meta name="viewport" content="initial-scale=1, user-scalable=no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />

	<meta property="og:title" content="Vil du også vinde en rejse?" />
	<meta property="og:description" content="Jeg har været med i Valget er dit, Stofas nye quiz. Hvis du kan gøre det ligeså godt som mig, så har du også chancen for at vinde lækre præmier og et rejsegavekort på 10.000 kr. Klik for at quizze med." />
	<meta property="og:image" content="http://valgeterdit.kaestel.dk/img/sharing.png" />
	<meta property="og:url" content="http://valgeterdit.kaestel.dk/" />

	<link rel="apple-touch-icon" href="/touchicon.png">
	<link rel="icon" href="/favicon.png">

	<link type="text/css" rel="stylesheet" media="all" href="/css/seg_<?= $_SESSION["segment"] ?>.css" />
	<script type="text/javascript" src="/js/seg_<?= $_SESSION["segment"] ?>.js"></script>

	<script src="/js/pixi-4.3.4.min.js" type="text/javascript"></script>
	<script src="/js/TweenLite-1.18.2.min.js" type="text/javascript"></script>
	<script src="/js/EasePack-1.18.2.min.js" type="text/javascript"></script>
</head>

<body class="signup">

	<div id="page" class="i:page" data-date="2018-01-13">

	<div id="header">
		<ul class="servicenavigation">
			<li class="keynav navigation nofollow"><a href="#navigation">To navigation</a></li>
		</ul>
	</div>

	<div id="content">
		<div class="scene signup i:signup">

			<form action="/signup/saveParticipant" method="post" class="labelstyle:inject" enctype="application/x-www-form-urlencoded">
				<input type="hidden" name="csrf-token" value="1da77a11-6e8c-4ae5-b93b-eabb99689c69" />

				<h2>
					Vi har brug for lidt information, så vi<br />
					kan kontakte dig med gode tilbud,<br />
					eller hvis du vinder.
				</h2>

				<fieldset class="data">
					<div class="field email required"><label for="input_email">Email</label><input type="email" name="email" id="input_email" autocomplete="off" maxlength="255" /><div class="help"><div class="hint">Indtast din email</div><div class="error">Det indtastede er ikke en gyldig email.</div></div></div>
					<div class="field tel required"><label for="input_phone">Telefon</label><input type="tel" name="phone" id="input_phone" autocomplete="off" maxlength="255" /><div class="help"><div class="hint">Indtast dit telefonnummer</div><div class="error">Det indtastede er ikke et gyldigt telefonnummer.</div></div></div>
					<div class="field string required"><label for="input_name">Navn</label><input type="text" name="name" id="input_name" autocomplete="off" maxlength="255" /><div class="help"><div class="hint">Indtast dit navn.</div><div class="error">Det indtastede er ikke en gyldigt.</div></div></div>
					<div class="field string required"><label for="input_lastname">Efternavn</label><input type="text" name="lastname" id="input_lastname" autocomplete="off" maxlength="255" /><div class="help"><div class="hint">Indtast dit efternavn.</div><div class="error">Det indtastede er ikke en gyldigt.</div></div></div>
					<div class="field string address required"><label for="input_address">Adresse</label><input type="text" name="address" id="input_address" autocomplete="off" maxlength="255" /><div class="help"><div class="hint">Indtast din adresse</div><div class="error">Det indtastede er ikke en gyldig adresse.</div></div></div>
					<div class="field string required"><label for="input_postal">Postnummer</label><input type="text" name="postal" id="input_postal" autocomplete="off" maxlength="255" pattern="[0-9]{4}" /><div class="help"><div class="hint">Indtast dit postnummer</div><div class="error">Det indtastede er ikke et gyldigt postnummer.</div></div></div>
					<div class="field string required"><label for="input_city">By</label><input type="text" name="city" id="input_city" autocomplete="off" maxlength="255" /><div class="help"><div class="hint">Indtast din by</div><div class="error">Det indtastede er ikke gyldigt.</div></div></div>
				</fieldset>

				<fieldset class="permissions">
					<div class="field checkbox required"><input type="hidden" name="permission" value="0" /><input type="checkbox" name="permission" id="input_permission" value="1" /><label for="input_permission">Jeg acceptérer <span class="terms">betingelserne</span>. Når jeg deltager i konkurrencen, siger jeg ja til, at Stofa gerne må ringe til mig og kontakte mig på mail, sms/mms og i onlinebannere med gode tilbud, events og konkurrencer, markedsføring og vejledning om produkter inden for internet, tv og telefoni. Stofa må bruge mine oplysninger om mit forbrug med henblik på at målrette henvendelser til mig. Jeg kan til enhver tid afmelde mig.</label><div class="help"><div class="hint">Giv os tilladelse til at kontakte dig.</div><div class="error">Det indtastede er ikke gyldigt.</div></div></div>
			
				</fieldset>

				<ul class="actions">
					<li class="signup"><input value="Deltag" type="submit" class="button" /></li>
					<li class="cancel"><input value="Fortryd" type="button" class="button" /></li>
				</ul>

			</form>

		</div>
	</div>

	<div id="navigation">
		<ul class="navigation"></ul>
	</div>

	<div id="footer"></div>

</div>

</body>
</html>