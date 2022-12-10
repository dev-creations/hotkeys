import jest from "jest";
import webhotkey, {setHotkeyOptions, getHotkeys} from "../dist/index.js";

describe("Basics", function() {
  it("should have exported members", function() {
    expect(webhotkey).not.toEqual(undefined);
    expect(setHotkeyOptions).not.toEqual(undefined);
    expect(getHotkeys).not.toEqual(undefined);
  });

  it("should add event", function() {
    webhotkey("CTRL+A", () => {});

    const hotkeys = getHotkeys();
    
    expect(hotkeys.length === 1).toEqual(true);
    expect(hotkeys[0].key).toEqual("CTRL+A");
    expect(typeof hotkeys[0].fn).toEqual("function");
  });

  it("should trigger event", function() {
    let i = 0;
    function testFn() { i++; }

    webhotkey("CTRL+A", testFn);

    const event = new KeyboardEvent('keydown', {'key': 'A', ctrlKey: true});
    document.dispatchEvent(event);

    expect(i).toEqual(1);

    document.dispatchEvent(event);

    expect(i).toEqual(2);
  });

  it("shouldn't trigger event when modifier is missing", function() {
    let i = 0;
    function testFn() { i++; }

    webhotkey("CTRL+ALT+A", testFn);

    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'A', ctrlKey: true}));
    expect(i).toEqual(0);
  });

  it("should trigger event with multiple modifiers", function() {
    let i = 0;
    function testFn() { i++; }

    webhotkey("CTRL+ALT+A", testFn);

    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'A', ctrlKey: true, altKey: true}));
    expect(i).toEqual(1);
  });

  it("should throw when trying to register a system key", function() {
    let i = 0;
    function testFn() { i++; }

    expect(webhotkey.bind(this, "CTRL+C", testFn)).toThrow(Error);

  });

  it("shouldn't throw trying to register a system key when option is disabled", function() {
    let i = 0;
    function testFn() { i++; }

    setHotkeyOptions({errorOnReserved: false});

    expect(webhotkey.bind(this, "CTRL+C", testFn)).not.toThrow(Error);
  });

  it("should throw when trying to register an empty key", function() {
    function testFn() {}

    expect(webhotkey.bind(this, "CTRL", testFn)).toThrow(Error);
  });

  it("should throw when trying to register an multi key with disabled option", function() {
    function testFn() {}

    setHotkeyOptions({allowMultipleKeys: false});

    expect(webhotkey.bind(this, "CTRL+A+B", testFn)).toThrow(Error);
  });
});