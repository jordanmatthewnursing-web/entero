// Run against a compiled local server, not the hosted prototype.
import assert from 'node:assert/strict';
const url = new URL(process.argv[2] || 'http://127.0.0.1:4188/');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname), 'Local server only');
const response = await fetch(url, {signal: AbortSignal.timeout(10000)});
assert.equal(response.status, 200, 'Initial document must return HTTP 200 before hydration');
const html = await response.text();
assert.ok(!html.includes('id="__next_error__"'), 'SSR error shell must not masquerade as a working client page');
assert.ok(html.includes('After a meal'), 'Teaching introduction must be server rendered');
console.log('Initial server-rendered document: HTTP 200 and teaching content, no error shell.');
