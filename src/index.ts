type HotkeyModifier = "CTRL" | "ALT" | "SHIFT" | "OPTION" | "CMD";
const HotkeyModifierMap: HotkeyModifier[] = ["CTRL", "ALT", "SHIFT", "OPTION", "CMD"];

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
  reservedIn: "Chrome" | "Windows" | "Firefox" | "Mac" | "Safari" | "System";
  options?: RegisterWebHotkey;
}

interface HotkeyOptions {
  allowMultipleKeys: boolean, // Allow assigning multiple functions per key
  errorOnReserved: boolean, // Throw when trying to assign ReservedHotKeys
  registerMacAlias: boolean, // Register iOS CMD for CTRL, Option for ALT
}

let hotkeyRegistry: Record<string, RegisteredFunction[]> = {}
const systemHotKeys: Record<string, ReservedHotKey[]> = {
  c: [{
    reservedIn: "System", options: { description: "Copy", modifier: ["CTRL"] }
  }],
  a: [{
    reservedIn: "System", options: { description: "Select All", modifier: ["CTRL"] }
  }]
}

const reservedHotKeys: Record<string, ReservedHotKey> = {}

let hotkeyOptions: HotkeyOptions = {
  allowMultipleKeys: true,
  errorOnReserved: true,
  registerMacAlias: true,
}

document.addEventListener("keydown", function(e: KeyboardEvent) {
  const formattedKey = e.key.toLocaleLowerCase();

  if (hotkeyRegistry[formattedKey]) {
    const mods: HotkeyModifier[] = [];

    if (e.ctrlKey) { mods.push("CTRL"); }
    if (e.altKey) { mods.push("ALT"); }
    if (e.shiftKey) { mods.push("SHIFT"); }
    if (e.metaKey) { mods.push("CMD"); }

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
        throw new Error("Trying to register a reserved key")
      }
    }
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