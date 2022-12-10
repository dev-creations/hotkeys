import webhotkey, {getHotkeys} from "/dist/index.js";

webhotkey("CTRL+ALT+C", () => {
  console.log("hello world!");
});

webhotkey("ALT+A", () => {
  console.log("hello world!");
}, {description: "Test Description"});


console.log(
  getHotkeys()
)