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
		<!--
			QR Scanner Code from https://github.com/nimiq/qr-scanner (MIT licensed)
			MIT License

			Copyright (c) 2017 Nimiq, danimoh

			Permission is hereby granted, free of charge, to any person obtaining a copy
			of this software and associated documentation files (the "Software"), to deal
			in the Software without restriction, including without limitation the rights
			to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
			copies of the Software, and to permit persons to whom the Software is
			furnished to do so, subject to the following conditions:

			The above copyright notice and this permission notice shall be included in all
			copies or substantial portions of the Software.

			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
			IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
			FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
			AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
			LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
			OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
			SOFTWARE.
		//-->

		<script src="/static/index.js" type="module"></script>
	</html>
`;
