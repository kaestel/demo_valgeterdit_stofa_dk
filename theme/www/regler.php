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

<body class="regler">

<div id="page" class="i:page" data-date="2018-01-13">

	<div id="header">
		<ul class="servicenavigation">
			<li class="keynav navigation nofollow"><a href="#navigation">To navigation</a></li>
		</ul>
	</div>

	<div id="content">
		<div class="scene rules i:rules">

			<h1>Sådan spiller du</h1>

			<div class="articlebody">
				<h2>Reglerne kort fortalt</h2>
				<ul>
					<li>Quiz med én gang om ugen.</li>
					<li>Jo flere rigtige svar, jo flere lodder samler du.</li>
					<li>Hver uge trækker vi lod om præmier.</li>
					<li>Alle dine lodder er med konkurrencen om hovedgevinsten: Rejsegavekort på 10.000kr.</li>
					<li>Er du i tvivl om svaret er Torkild klar med et tip.</li>
				</ul>

				<h2>Regler</h2>
				<p>
					Hver uge kan du på www.stofa.dk/valgeterdit deltage i en interaktiv quiz med 9 spørgsmål indenfor ugens kategori. Du kan deltage <strong>én gang pr. uge</strong>, så sørg for at indsamle så mange lodder som muligt, når du er i gang. Hvert rigtigt svar giver ét lod i konkurrencen. 
				</p>
				<p>
					Du kan maks. svare på <strong>9 spørgsmål hver uge i 4 uger</strong>, og hvert rigtigt svar giver et lod i konkurrencen 
					om ugens præmie, samt om den samlede hovedgevinst, der udtrækkes ved konkurrencens udløb.
				</p>
				<p>
					Efter konkurrenceperioden på de 4 uger er overstået, kan du spille med i alle kategorierne, dog uden mulighed for gevinst.
				</p>
				<p>
					<strong>God fornøjelse.</strong>
				</p>
			</div>

		</div>
	</div>

	<div id="navigation">
		<ul class="navigation"></ul>
	</div>

	<div id="footer"></div>

</div>

</body>
</html>