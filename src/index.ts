type HotkeyModifier = "CTRL" | "ALT" | "SHIFT" | "CMD";
const HotkeyModifierMap: HotkeyModifier[] = ["CTRL", "ALT", "SHIFT", "CMD"];

interface RegisterWebHotkey {
  description?: string;
  modifier?: typeof HotkeyModifierMap;
}

interface RegisteredFunction {
  fn: Function;
  modifier: typeof HotkeyModifierMap;
  description?: string;
}

interface ReservedHotKey {
  reservedIn: "System" | "Browser" | "Mac";
  options?: RegisterWebHotkey;
}

interface HotkeyOptions {
  allowMultipleKeys: boolean, // Allow assigning multiple functions per key
  errorOnReserved: boolean, // Throw when trying to assign ReservedHotKeys
}

let hotkeyRegistry: Record<string, RegisteredFunction[]> = {}
const systemHotKeys: Record<string, ReservedHotKey[]> = {
  space: [
    { reservedIn: "Mac", options: { description: "Spotlight Search", modifier: ["CTRL"] } },
    { reservedIn: "Mac", options: { description: "Spotlight Search", modifier: ["CMD"] } },
  ],
  a: [
    { reservedIn: "System", options: { description: "Select All", modifier: ["CTRL"] } },
    { reservedIn: "System", options: { description: "Select All", modifier: ["CMD"] } },
  ],
  c: [
    { reservedIn: "System", options: { description: "Copy", modifier: ["CTRL"] } },
    { reservedIn: "System", options: { description: "Copy", modifier: ["CMD"] } },
  ],
  f: [
    { reservedIn: "System", options: { description: "Find", modifier: ["CTRL"] } },
    { reservedIn: "System", options: { description: "Find", modifier: ["CMD"] } },
  ],
  p: [
    { reservedIn: "System", options: { description: "Print", modifier: ["CTRL"] } },
    { reservedIn: "System", options: { description: "Print", modifier: ["CMD"] } },
  ],
  s: [
    { reservedIn: "System", options: { description: "Save", modifier: ["CTRL"] } },
    { reservedIn: "System", options: { description: "Save", modifier: ["CMD"] } },
  ],
  t: [
    { reservedIn: "Browser", options: { description: "New Tab", modifier: ["CTRL"] } },
    { reservedIn: "Browser", options: { description: "New Tab", modifier: ["CMD"] } },
  ],
  v: [
    { reservedIn: "System", options: { description: "Paste", modifier: ["CTRL"] } },
    { reservedIn: "System", options: { description: "Paste", modifier: ["CMD"] } },
  ],
  x: [
    { reservedIn: "System", options: { description: "Cut", modifier: ["CTRL"] } },
    { reservedIn: "System", options: { description: "Cut", modifier: ["CMD"] } },
  ],
  z: [
    { reservedIn: "System", options: { description: "Undo", modifier: ["CTRL"] } },
    { reservedIn: "System", options: { description: "Undo", modifier: ["CMD"] } },
  ],
}

const reservedHotKeys: Record<string, ReservedHotKey> = {}

let hotkeyOptions: HotkeyOptions = {
  allowMultipleKeys: true,
  errorOnReserved: true,
}

const specialKeys = {
  ' ': 'space',
}

const formatKey = (key: string) => {
  const lowerCaseKey = key.toLocaleLowerCase();
  const specialKey = specialKeys[lowerCaseKey as keyof typeof specialKeys];
  return specialKey || lowerCaseKey;
}

document.addEventListener("keydown", function(e: KeyboardEvent) {
  const formattedKey = formatKey(e.key);

  if (hotkeyRegistry[formattedKey]) {
    const mods: HotkeyModifier[] = [];

    if (e.ctrlKey) { mods.push("CTRL"); }
    if (e.metaKey) { mods.push("CMD"); }
    if (e.altKey) { mods.push("ALT"); }
    if (e.shiftKey) { mods.push("SHIFT"); }

    const execKeys = [];

    if (mods.length === 0) {
      execKeys.push(...hotkeyRegistry[formattedKey]
        .filter(reg => reg.modifier.length === 0))
    } else {
      execKeys.push(...hotkeyRegistry[formattedKey]
        .filter(reg => {
          return containsAllModifyKeys(reg.modifier, mods);
        }));
    }

    for (const execKey of execKeys) {
      execKey.fn();
    }
  }
});

function setHotkeyOptions(options: Partial<HotkeyOptions>) {
  hotkeyOptions = {...hotkeyOptions, ...options};
}

function getHotkeys() {
  const hotkeys = [];
  const keys = Object.keys(hotkeyRegistry);
  for (const key of keys) {
    const regKey = hotkeyRegistry[key];
    hotkeys.push(...regKey.map(k => ({
      key: k.modifier.join("+") + "+" + key.toUpperCase(),
      ...k,
    })))
  }


  return hotkeys;
}

function containsAllModifyKeys(modKeyArr: HotkeyModifier[], checkModKeyArr: HotkeyModifier[]) {
  return checkModKeyArr.every(c => modKeyArr.includes(c)) && modKeyArr.every(c => checkModKeyArr.includes(c));
}

function removeAllHotkeys() {
  hotkeyRegistry = {};
}

export {
  setHotkeyOptions,
  getHotkeys,
  removeAllHotkeys,
};

export default function(hotkey: keyof typeof hotkeyRegistry, fn: Function, options?: RegisterWebHotkey) {
  const formattedHotkey = hotkey.split("+").filter(key => !HotkeyModifierMap.includes(key.toUpperCase() as HotkeyModifier)).map(key => key.toLowerCase()).join("+");
  const mods: typeof HotkeyModifierMap = [];

  if (/\+/.test(hotkey)) {
    const modParts = hotkey.split("+").map(c => c.toUpperCase());
    for (const part of modParts) {
      if (HotkeyModifierMap.includes(part as HotkeyModifier)) {
        mods.push(part as HotkeyModifier);
      }
    }
  }

  if (options?.modifier) {
    mods.push(...options.modifier);
  }

  if (hotkeyOptions.errorOnReserved && systemHotKeys[formattedHotkey]) {
    for (const systemKey of systemHotKeys[formattedHotkey]) {
      if (containsAllModifyKeys(mods, systemKey.options?.modifier || [])) {
        throw new Error(`Trying to register a reserved key. The key is registered for "${systemKey.options?.description}" in "${systemKey.reservedIn}".`)
      }
    }
  }

  if (mods.length === 0) {
    throw new Error("No modifier defined");
  }

  if (!hotkeyOptions.allowMultipleKeys && formattedHotkey.length > 1) {
    throw new Error("Multiple Keys are not allowed");
  }

  if (formattedHotkey.length === 0) {
    throw new Error("No key has been defined");
  }

  if (!hotkeyRegistry[formattedHotkey]) {
    hotkeyRegistry[formattedHotkey] = [];
  }

  hotkeyRegistry[formattedHotkey].push({fn, description: options?.description, modifier: mods});
}