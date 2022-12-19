import { setHotkey, getHotkeys } from "/dist/index.mjs";

setHotkey("CTRL+ALT+C", () => {
  console.log("hello world!");
});

setHotkey("ALT+A", () => {
  console.log("hello world!");
}, {description: "Prints 'hello world!' to the console"});

setHotkey("ALT+A", () => {
  console.log("hello world2!");
}, {description: "Prints 'hello world2!' to the console"});

setHotkey("C", () => {
  console.log("hello world2!");
}, {modifier: ["CTRL", "ALT"]});

const hotkeys = getHotkeys();

for (const hotkey of hotkeys) {
  const tbody = document.querySelector("tbody");
  const template = document.querySelector('#keyrow');
  const clone = template.content.cloneNode(true);
  let td = clone.querySelectorAll("td");

  td[0].textContent = hotkey.key;
  td[1].textContent = hotkey.description;

  tbody.appendChild(clone);
}