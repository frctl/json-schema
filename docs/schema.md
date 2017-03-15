# Condensed JSON Schema Specification

JSON Schema shorthand definition specification.

## Overview

Expand Javascript shorthand:

```javascript
{ title: 'string', text: 'string' }
```

into JSON Schema:

```json
{
  "$schema": "http://json-schema.org/schema#",
  "id": "@component",
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
  "id": "@pill",
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

```javascript
{ modifier: 'string', text: 'string' }
```

1. A top-level object is assumed to define a component object schema, and so is assigned a `$schema` value and an `id` property based on the component path.
2. Each `'property': value` pair is assumed to represent an item on `"properties"`.

  1. if `value` is a `string`, `'property': 'value'` is mapped to `"property": { "type": "value" }`,
  2. if `value` is an `object`, `'property': value` is mapped to `"property": value`. If the `'type'` property is absent from `value`, `"string"` is inferred.

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
  "id": "@button",
  "type": "object",
  "properties": {
    "disabled": {
      "type": "boolean"
    },
    "modifiers": {
      "type": "string",
      "enum": ["large", "small", "primary"]
    },
    "iconName": {
      "type": "string"
    },
    "iconClasses": {
      "type": "string"
    },
    "text": {
      "type": "string"
    },
    "href": {
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

```javascript
{
  disabled: 'boolean',
  modifiers: ['large', 'small', 'primary'],
  iconName: 'string',
  iconClasses: { dependencies: 'iconName' },
  text: { required: true },
  href: 'string'
}
```
2. An array `value` is assumed to be an enum. If all items in the array are the same type, them enum will be declared to be of that type; otherwise no type will be declared.
3. Certain properties that match top-level JSON Schema object properties, such as `dependencies`, are hoisted.

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
  "id": "@list",
  "type": "object",
  "properties": {
    "listItems": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "otherList": {
      "type": "array"
    },
    "finalList": {
      "type": "array"
    }
  }
}
```

JS Shorthand:

```javascript
{
  listItems: 'string[]',
  otherList: '[]',
  finalList: 'array'
}
```

Given a `'property': value` pair:

1. If `value` equals `'array'|'[]'`, then `'property': 'value'` is mapped to `"property": { "type": "array" }`.
1. If `value` matches `'{type}[]'`, then `'property': 'value'` is mapped to `"property": { "type": "array", "items": { "type": "{type}" } }`.


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
  "id": "@badge",
  "type": "object",
  "properties": {
    "modifiers": {
      "type": "string"
    },
    "img": {
      "type": "object",
      "properties": {
        "modifiers": {
          "type": "string",
          "enum": ["primary", "secondary"]
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
      "$ref": "@pill"
    },
    "title": {
      "type": "string"
    },
  },
  "required": ["title"]
}
```
JS shorthand:
```javascript
{
  modifier: 'string',
  pill: '@pill',
  img: {
    modifiers: ['primary', 'secondary'],
    src: 'string',
    alt: 'string'
  },
  title: { required: true }
}
```

1. To refer to other components, a component name with an '@' identifier will be expanded to a $ref.



QUESTION 1: should a convention be able to define a non-component ref, similar to <https://metacpan.org/pod/JSON::Schema::Shorthand?> i.e.

```javascript
{
  pill: '#/units/pill'
}
```
