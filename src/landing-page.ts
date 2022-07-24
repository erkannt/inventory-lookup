export const landingPage = `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
			<title>DMUN Inventar Scanner</title>
			<script src="https://unpkg.com/html5-qrcode" type="text/javascript"></script>
			<link rel="stylesheet" href="https://vanillacss.com/vanilla.css">
			<link rel="stylesheet" href="/static/styles.css">
		</head>
		<body>
			<div class="reader" id="reader"></div>
			<div class="result-wrapper">
				<div id="result">
					<h1>Inventar Scanner</h1>
					<p>Kamera freigeben und los gehts.</p>
				</div>
			</div>
			<script src="/static/index.js"></script>
		</body>
	</html>
`;
