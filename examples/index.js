import webhotkey, {getHotkeys} from "/dist/index.js";

webhotkey("CTRL+ALT+C", () => {
  console.log("hello world!");
});

webhotkey("ALT+A", () => {
  console.log("hello world!");
}, {description: "Prints 'hello world!' to the console"});

webhotkey("ALT+A", () => {
  console.log("hello world2!");
}, {description: "Prints 'hello world2!' to the console"});

webhotkey("C", () => {
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