# JSON Schema

Parser to convert condensed JSON schemas to standard ones.

[![Build Status](https://img.shields.io/travis/frctl/json-schema/master.svg?style=flat-square)](https://travis-ci.org/frctl/json-schema)
[![NPM Version](https://img.shields.io/npm/v/@frctl/json-schema.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/json-schema)

## Overview

This is a parser that generates a fully qualified [JSON Schema](http://json-schema.org/) based on 'condensed' JSON schema input. From [Understanding JSON Schema](https://spacetelescope.github.io/understanding-json-schema/):
> JSON Schema is a powerful tool for validating the structure of JSON data.

### Rationale
[JSON Schema](http://json-schema.org/) is extremely useful for validation purposes; however, in some use cases it may also be more verbose than necessary. This tool was created to allow users of [Fractal](https://github.com/frctl/v2) to add specifications to their components, whilst hiding some of the complexity of the full specification.

```js

const schemaExpander = require('@frctl/json-schema');

const schema = schemaExpander.expand({ title: 'string', modifier: 'string' });

console.log(schema);

/*
Outputs:

{
  "$schema": "http://json-schema.org/schema#",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "modifier": {
      "type": "string"
    }
  }
}

*/
```

## Installation

```bash
npm i @frctl/json-schema --save
```

## API

### .expand(schema)

Returns a fully qualified JSON schema.

* `schema`: A [Condensed JSON schema](/docs/schema.md)


```js
const schema = jsonSchema.parse({ title: 'string', modifier: 'string' });
```

- If a valid condensed schema is provided, a converted, fully qualified schema will be returned.
- If an already fully qualified schema is provided, it will return that.
- If an invalid schema is provided, it will return an empty schema (i.e. all data will validate).


## Resources
* [Condensed JSON Schema specification](/docs/schema.md)
* [JSON Schema Validator](http://www.jsonschemavalidator.net/)
* [Understanding JSON Schema](https://spacetelescope.github.io/understanding-json-schema/)

## Requirements

Node >= v6.0 is required.
