import webhotkey, {setHotkeyOptions, getHotkeys, removeAllHotkeys} from "../dist/index.js";

describe("Basics", function() {
  // Reset all options
  beforeEach(function() {
    removeAllHotkeys();
    setHotkeyOptions({allowMultipleKeys: true, errorOnReserved: true});
  });

  it("should have exported members", function() {
    expect(webhotkey).not.toEqual(undefined);
    expect(setHotkeyOptions).not.toEqual(undefined);
    expect(getHotkeys).not.toEqual(undefined);
    expect(removeAllHotkeys).not.toEqual(undefined);
  });

  it("should add event", function() {
    webhotkey("ALT+A", () => {});

    const hotkeys = getHotkeys();
    
    expect(hotkeys.length).toEqual(1);
    expect(hotkeys[0].key).toEqual("ALT+A");
    expect(typeof hotkeys[0].fn).toEqual("function");
  });

  it("should add event, modifier should be case-insensitive", function() {
    webhotkey("alt+A", () => {});

    const hotkeys = getHotkeys();
    
    expect(hotkeys.length).toEqual(1);
    expect(hotkeys[0].key).toEqual("ALT+A");
    expect(typeof hotkeys[0].fn).toEqual("function");
  });

  it("should trigger event", function() {
    let i = 0;
    function testFn() { i++; }

    webhotkey("ALT+A", testFn);

    const event = new KeyboardEvent('keydown', {'key': 'A', altKey: true});
    document.dispatchEvent(event);

    expect(i).toEqual(1);

    document.dispatchEvent(event);

    expect(i).toEqual(2);
  });

  it("should trigger event with iOS CMD key when iOS is true", function() {
    let i = 0;
    function testFn() { i++; }

    webhotkey("ALT+CMD+A", testFn);

    const event = new KeyboardEvent('keydown', {'key': 'A', altKey: true, metaKey: true});
    document.dispatchEvent(event);

    expect(i).toEqual(1);

    document.dispatchEvent(event);

    expect(i).toEqual(2);
  });

  it("should register multiple functions for same key trigger event", function() {
    let i = 0;
    function testFn() { i++; }

    webhotkey("ALT+A", testFn);
    webhotkey("ALT+A", testFn);

    const event = new KeyboardEvent('keydown', {'key': 'A', altKey: true});
    document.dispatchEvent(event);

    expect(i).toEqual(2);
  });

  it("shouldn't trigger partial modifiers", function() {
    let i = 0;
    function testFn() { i++; }

    webhotkey("CTRL+ALT+A", testFn);
    webhotkey("ALT+A", testFn);

    const event = new KeyboardEvent('keydown', {'key': 'A', ctrlKey: false, altKey: true});
    document.dispatchEvent(event);

    expect(i).toEqual(1);
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
    function testFn() { }

    expect(webhotkey.bind(this, "CTRL+C", testFn)).toThrow(Error);

  });

  it("shouldn't throw trying to register a system key when option is disabled", function() {
    function testFn() { }

    setHotkeyOptions({errorOnReserved: false});

    expect(webhotkey.bind(this, "CTRL+C", testFn)).not.toThrow(Error);
  });

  it("should throw when adding a key without modifier", function() {
    expect(webhotkey.bind(this, "A", () => {})).toThrow(Error);
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