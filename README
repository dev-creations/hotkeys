# Hotkeys for the Web

WebHotkeys is a small library that helps you to register hotkeys on your website.

The current version is unstable and untested, use at your own risk. Issues and PRs are welcome.

## Usage

The following example would execute an anonymous function that logs "hello world!" to the console whenever a user presses CTRL+ALT+C.

```js
import webhotkey from "@dev-creations/hotkeys";

webhotkey("CTRL+ALT+C", () => {
  console.log("hello world!");
});
```

## Assigning to system keys

Trying to assign a hotkey to a reserved key would throw an error: 

```js
import webhotkey from "@dev-creations/hotkeys";

webhotkey("CTRL+C", () => {
  console.log("hello world!");
});
// -> Throws an error 'Trying to register a reserved key'
```

If you want to enable assigning a hotkey to a system key you have to use an option:

```js
import webhotkey, {setHotkeyOptions} from "@dev-creations/hotkeys";

setHotkeyOptions({errorOnReserved: false});

webhotkey("CTRL+C", () => {
  console.log("hello world!");
});
```