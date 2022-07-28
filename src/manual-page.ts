import { head } from './page-head';

export const manualPage = `
	<!DOCTYPE html>
	${head('DMUN Inventar Abfrage')}
	<html lang="en">
		<body class="app">
			<div class="manual-input">
				<h1>Manuelle Abfrage</h1>
				<form id="manual-query">
					<label for="query">Inventar Nummer:</label>
					<input type="text" id="query">
					<button type="submit">Abfragen</button>
				</form>
			</div>
			<div class="result-wrapper">
				<div id="result"></div>
			</div>
			<nav class="nav">
				<a href="/">Zurück zum scanner</a>
			</nav>
		</body>
		<script src="/static/qr-scanner.min.js" type="module"></script>
		<script src="/static/index.js" type="module"></script>
	</html>
`;
