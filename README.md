# Hotkeys for the Web

WebHotkeys is a small library that helps you to register hotkeys on your website.

The current version is unstable and untested, use at your own risk. Issues and PRs are welcome.

## Usage

The following example would execute an anonymous function that logs "hello world!" to the console whenever a user presses CTRL+ALT+C.

```js
import { setHotkey } from "@dev-creations/hotkeys";

setHotkey("CTRL+ALT+C", () => {
  console.log("hello world!");
});
```

You can also add modifiers using options. This will produce the same functionality:

```js
import { setHotkey } from "@dev-creations/hotkeys";

setHotkey("C", () => {
  console.log("hello world!");
}, {modifier: ["CTRL", "ALT"]});
```

## Assigning to system keys

Trying to assign a hotkey to a reserved key would throw an error: 

```js
import { setHotkey } from "@dev-creations/hotkeys";

setHotkey("CTRL+C", () => {
  console.log("hello world!");
});
// -> Throws an error 'Trying to register a reserved key'
```

If you want to enable assigning a hotkey to a system key you have to use an option:

```js
import { setHotkey, setHotkeyOptions} from "@dev-creations/hotkeys";

setHotkeyOptions({errorOnReserved: false});

setHotkey("CTRL+C", () => {
  console.log("hello world!");
});
```

## Listing hotkeys

You can use the `getHotkeys` function to list all hotkeys. 

```js
import { setHotkey, getHotkeys } from "@dev-creations/hotkeys";

setHotkey("CTRL+ALT+C", () => {
  console.log("hello world!");
}, {description: "Prints hello world"});

console.log(getHotkeys());

// [{ key: "CTRL+ALT+C", description: "Prints hello world", modifier: ["CTRL", "ALT"], fn: ... }]
```

Use `getHotkeys` to create an overview of your hotkeys for your users.

## Removing all hotkeys

You can remove all hotkeys by using `removeAllHotkeys`.

```js
import { setHotkey, getHotkeys, removeAllHotkeys } from "@dev-creations/hotkeys";

setHotkey("CTRL+ALT+C", () => {
  console.log("hello world!");
}, {description: "Prints hello world"});

removeAllHotkeys();

console.log(getHotkeys());

// Array(0)
```