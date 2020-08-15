#  Jelli: Documentation :: Getting Started  #

##  Al·rishāʼ  ##

Jelli uses RDF as its core data framework, and subsequently depends on [Al·rishāʼ](https://github.com/marrus-sh/Alrescha) for its RDF processing.
These batteries are *not* included—you will have to supply the library on your own.

```js
import Al·rishāʼ from "./Al·rishāʼ/index.jsm"
```

It is *recommended* (for your own convenience) that you use a single namespace for all of your resources, following usual RDF conventions.
By overwriting Al·rishāʼ·s `context`, you can then use the `pname` tag to easily expand resource names.

```js
const newContext = Object.assign(
    { "": `example:game#` },
    Al·rishāʼ.context)
Object.defineProperty(Al·rishāʼ, `context`, { value: newContext })

Al·rishāʼ.pname `:foo`
//→ <example:game#foo>
```

Alternatively (if you don’t want to modify the default context) you can bind your own `pname` function as above.

```js
const pname = Al·rishāʼ.pname.bind({ "": `example:game#` })

pname `:bar`
//→ <example:game#bar>
```

You can of course add other prefixes to these contexts as well; for example, the Jelli namespace at:

    https://go.KIBI.family/Ontologies/Jelli/#

The `baseURI` property can be overwritten to supply a base IRI for Al·rishāʼ to use when processing relative IRIs.
Note that Al·rishāʼ·s IRI processing is relatively simplistic, as is typical for RDF libraries.

```js
Al·rishāʼ.baseURI = new URL (`http://example.com/Resources/`)

Al·rishāʼ.RDFNode.fromNT `<foo>`
//→ <http://example.com/Resources/foo>
```
