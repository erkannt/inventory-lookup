import { head } from './page-head';

export const scannerPage = `
	<!DOCTYPE html>
	<html lang="en">
		${head('DMUN Inventar Scanner')}
		<body>
			<video class="reader" id="reader"></video>
			<div class="result-wrapper">
				<div id="result">
					<h1>Inventar Scanner</h1>
					<button id="start-camera">Kamera starten</button>
					<p>Kamera freigeben und los gehts.</p>
				</div>
			</div>
			<a href="/manual">Manuelle Eingabe</a>
		</body>
		<script src="/static/qr-scanner.min.js" type="module"></script>
		<script src="/static/index.js" type="module"></script>
	</html>
`;
