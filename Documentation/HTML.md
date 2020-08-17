#  Jelli: Documention :: HTML Elements  #

A Jelli game consists of scripting, data, and HTML code.
For the last of these, Jelli provides HTML custom elements which tie together the game interface and power the engine.
These are: `<jelli-ii-game>`, `<jelli-ii-surface>`, and `<jelli-ii-key>`.

##  The Jelli II Game Element  ##

**HTML:** `<jelli-ii-game>`<br/>
**ECMAScript:** `new Game ()`

The `<jelli-ii-game>` element manages the Jelli elements which it contains, and provides the main scripting API for interacting with the engine.
Otherwise, it has no special behaviours regarding its elements or attributes.

For more information regarding the API of this element, see the documentation on the [Jelli API](./API.md).

##  The Jelli II Surface Element  ##

**HTML:** `<jelli-ii-surface>`<br/>
**ECMAScript:** `new Surface ()`

The `<jelli-ii-surface>` element provides a surface in two senses:
First, it is a rendering surface, in the form of a `<canvas>` element, onto which the game’s sprites will be drawn; secondly, it is a surface for receiving pointer events (touches and clicks).
The width and height of the surface can be set using the `width` and `height` attributes; in a practical sense, these define the *game units* of the surface (which need not correspond to its actual rendered width and height.)

Each `<jelli-ii-surface>` element can render a single area at a given time; this can be set via the `area` property by assigning it an appropriate `Game.Symbol`, or cleared by setting it to `null`.
Rendering and logic for the area is controlled by the nearest ancestor `<jelli-ii-game>`.

Pointer interactions are stored as `Surface.Poke`s, which are accessible from the `pokes` property (as a proxied `Array`).
For more information regarding `Surface.Poke` objects, see the documentation on [Jelli UI](./UI.md).

##  The Jelli II Key Element  ##

**HTML:** `<jelli-ii-key>`<br/>
**ECMAScript:** `new Key ()`

The `<jelli-ii-key>` element represents an “abstract” key, or game button, which is at any given time either pressed or unpressed, indicated by the presence or absence of an `active` attribute on the element, and mirrored by its `active` property.
When a descendant of a `<jelli-ii-game>` elememt, this attribute will be added and removed automatically based on the values of the `codes` and `gamepadmapping` attributes, each of which take a space-separated string of either [keyboard codes](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values) or [gamepad button indices](https://w3c.github.io/gamepad/#remapping), respectively.
It will also, of course, be toggled active when a pointer is held down over the element (it acts like a button).

The `label` attribute can be used to provide a readable label for the key.
The element’s contents will be rendered in the resulting button.

There is no requirement that `<jelli-ii-key>` elements be displayed onscreen to operate; they can be hidden with CSS if devices without keyboards are not supported.
