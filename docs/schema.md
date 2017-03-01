# Condensed JSON Schema Specification

JSON Schema shorthand definition specification.

## Overview
Expand Javascript shorthand:
```js
['title', 'text']
```
into JSON Schema:
```json
{
  "$schema": "http://json-schema.org/schema#",
  "id": "/collection/component",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "text": {
      "type": "string"
    }
  }
}
```


## Examples

### Pill component
Template:
```handlebars
<div class="pill{{#if modifiers }} {{ modifiers }}{{/if}}">
  <span class="pill__text">{{ text }}</span>
</div>
```

JSON schema:
```json
{
  "$schema": "http://json-schema.org/schema#",
  "id": "/units/pill",
  "type": "object",
  "properties": {
    "modifiers": {
      "type": "string"
    },
    "text": {
      "type": "string"
    }
  }
}
```
1. A top-level array is assumed to define a component object spec, and so is assigned a `$schema` value and an `id` property based on the component path.
2. Arrays of values are assumed to be a list of object `properties`.
1. By default, each array string item `[value]` is mapped to `"[value]": { "type": "string" }`,

This enabling the following JS shorthand:
```js
['modifier', 'text']
```

### Button component
Template:
```handlebars
<a class="action{{#if modifiers }} {{ modifiers }}{{/if}}" href="{{href}}" {{#if disabled}}disabled{{/if}}>
	<span class="action__inner">
  	<span class="action__text">{{{ text }}}</span>
    {{#if iconName}}
      {{#if iconClasses}}
      	{{>@icon-item id=iconName decorative="true" svgTitle="Call to action"}}
      {{else}}
      	{{>@icon-item id=iconName decorative="true" iconClasses="icon--mini" svgTitle="Call to action"}}
    	{{/if}}
    {{/if}}
  </span>
</a>
```

JSON schema:
```json
{
  "$schema": "http://json-schema.org/schema#",
  "id": "/units/button",
  "type": "object",
  "properties": {
    "href": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean"
    },
    "modifiers": {
      "type": "string"
    },
    "iconName": {
      "type": "string"
    },
    "iconClasses": {
      "type": "string"
    },
    "text": {
      "type": "string"
    }
  },
  "required": ["text", "href"],
  "dependencies": {
    "iconClasses": ["iconName"]
  }
}
```
1. If an array item is an `object`, with a `[key]:[value]` pair:
   1. if `[value]` is a `string`, `[key]:[value]` is mapped to `"[key]": { "type": "[value]" }`,
   1. if `[value]` is an `object`, `[key]:[value]` is mapped to `"[key]": [value]`. If the `type` property is absent from `[value]`, `string` is inferred.
1. Any properties that match top-level JSON Schema `object` properties are bubbled up.

This results in the following JS shorthand:
```js
[
  'tag',
  'href',
  { 'disabled': 'boolean' }, // 1.1.
  'modifiers',
  'iconName',
  { 'iconClasses': { dependencies: 'iconName' }}, // 1.2., 2.
  { 'text': { required: true }} // 1.2., 2.
]


```

### List component
Template:
```handlebars
<ul class="list">
{{#each listItems}}
  <li class="List-item">{{this}}</li>
{{/each}}
</ul>
```
JSON schema:
```json
{
  "$schema": "http://json-schema.org/schema#",
  "id": "/patterns/badge",
  "type": "object",
  "properties": {
    "listItems": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": ["title"]
}
```
If an array item is an `object`, with a `[key]:[value]` pair:
1. And `[value]` equals `'array'`, then `[key]:[value]` is mapped to `"[key]": { "type": "array", "items": { "type": "string" } }`.
2. And `[value]` is an `object` with a single `[key1]` of `'array'` and `[value1]` is a string, then `[key]:[value]` is mapped to `"[key]": { "type": "array", "items": { "type": "[value1]" } }`.

This enables the following JS Shorthand:
```js
[
  'type',
  { 'listItems': 'array' } // 1.
  // or { 'listItems': { 'array': 'string' } } : 2.
]
```

### Badge component
Template:
```handlebars

<figure class="badge{{#if modifiers}} {{ modifiers }}{{/if}}">
    {{#if img}}<img class="badge__image {{img.modifiers}}" src="{{img.src}}" alt="{{img.alt}}">{{/if}}
    <figcaption class="badge__caption">
        {{#if pill}}{{> @pill pill}}{{/if}}
        <h1 class="badge__label">{{ title }}</h1>        
    </figcaption>
</figure>
```

JSON schema:
```json
{
  "$schema": "http://json-schema.org/schema#",
  "id": "/patterns/badge",
  "type": "object",
  "properties": {
    "modifiers": {
      "type": "string"
    },
    "img": {
      "type": "object",
      "properties": {
        "modifiers": {
          "type": "string"
        },
        "src": {
          "type": "string"
        },
        "alt": {
          "type": "string"
        }
      }
    },
    "pill": {
      "$ref": "/units/pill"
    },
    "title": {
      "type": "string"
    },
  },
  "required": ["title"]
}
```

JS shorthand:
```js
[
  'modifier',
  { 'pill': { '$ref': '/units/pill'} },
  { 'img': [
    'modifiers',
    'src',
    'alt'
  ]},
  { 'title': { required: true } }
]
```
