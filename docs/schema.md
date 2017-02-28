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

JS shorthand:
```js
// By default, each array string item 'value' is mapped to "value": { "type": "string" }

['modifier', 'text']
```

### Button component
Template:
```handlebars
<a class="action{{#if modifiers }} {{ modifiers }}{{/if}}" href="{{#if href}}{{href}}{{else}}#{{/if}}" {{#if disabled}}disabled{{/if}}>
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
  "required": ["text"],
  "dependencies": {
    "iconClasses": ["iconName"]
  }
}
```

JS shorthand:
```js
[
  'tag',
  'href',
  // If an array item is an object, then the object's
  // 'key': 'value' is mapped to "key": { "type": "value" }
  // if 'value' is also a string.
  { 'disabled': 'boolean' },
  'modifiers',
  'iconName',
  // If an array item is an object, then the object's 
  // 'key': 'value' is mapped to "key": value
  // if 'value' is an object. If the 'type' if missing, "string" is inferred. Any properties that match top-level JSON Schema 'object' properties are bubbled up.
  { 'iconClasses': { dependencies: 'iconName' }},
  { 'text': { required: true }}
]


```

### List component
Template:
```handlebars
<ul class="list{{#if modifiers }} {{ modifiers }}{{/if}}">
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
    "modifiers": {
      "type": "string"
    },
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

JS Shorthand:
```js
[
  'type',
  { 'listItems': 'array' } // By default, array of strings
  // or { 'listItems': { 'array': 'string' } }
]
```

### Badge component
Template:
```handlebars
<figure class="badge{{#if modifiers}} {{ modifiers }}{{/if}}">
    <img class="badge__image" src="{{imgSrc}}" alt="Profile">
    <figcaption class="badge__caption">
    	{{#if quote}}<blockquote class="badge__quote">{{quote}}</blockquote>{{/if}}
        {{#if pill}}{{> @pill pill}}{{/if}}
        <h1 class="badge__label">{{#if url}}<a href="{{url}}">{{/if}}{{ title }}{{#if url}}</a>{{/if}}</h1>
        {{#if subTitle}}<h2 class="badge__subLabel">{{{subTitle}}}</h2>{{/if}}
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
    "imgSrc":{
      "type":"string"
    },
    "quote": {
      "type": "string"
    },
    "pill": {
      "$ref": "/units/pill"
    },
    "url": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "subTitle": {
      "type": "string"
    }
  },
  "required": ["title"]
}
```

JS shorthand:
```js
[
  'modifier',
  'quote',
  { 'pill': { '$ref': '/units/pill'} },
  'url',
  { 'title': { required: true } }
]
```
