import { head } from './page-head';

export const manualPage = `
	<!DOCTYPE html>
	${head('DMUN Inventar Abfrage')}
	<html lang="en">
		<body>
			<h1>Manuelle Abfrage</h1>
			<fieldset>
				<input type="text">
				<button>Abfragen</button>
			</fieldset>
			<div id="result"></div>
			<a href="/">Zurück zum scanner</a>
		</body>
		<script src="/static/qr-scanner.min.js" type="module"></script>
		<script src="/static/index.js" type="module"></script>
	</html>
`;
