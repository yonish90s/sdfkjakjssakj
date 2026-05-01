const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
dom.window.document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");
});
dom.window.addEventListener('error', (event) => {
    console.log("JS Error:", event.error);
});
setTimeout(() => {
    console.log("Featured Products HTML length:", dom.window.document.getElementById('featured-products').innerHTML.length);
}, 2000);
