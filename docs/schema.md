# Condensed JSON Schema Specification

JSON Schema shorthand definition specification.

## Overview
Expand:
```json
["tag", "modifier"]
```
into :
```json
{
  "$schema": "http://json-schema.org/schema#",
  "type": "object",
  "properties": {
    "tag": {
      "type": "string"
    },
    "modifier": {
      "type": "string"
    }
  }
}
```


## Examples

### Button component
Template:
```handlebars
<{{#if tag}}{{tag}}{{/if}}{{#unless tag}}a{{/unless}} class="Action {{ modifier }}" href="{{#if href}}{{href}}{{else}}#{{/if}}" {{#if disabled}}disabled{{/if}}>
	<span class="Action-inner">
	<span class="Action-text">{{{ text }}}</span>
  {{#if iconName}}
    {{#if iconClasses}}
    	{{>@icon-item id=iconName decorative="true" svgTitle="Call to Action"}}
    {{else}}
    	{{>@icon-item id=iconName decorative="true" iconClasses="Icon--mini" svgTitle="Call to Action"}}
  	{{/if}}
  {{/if}}
  </span>
</{{#if tag}}{{tag}}{{/if}}{{#unless tag}}a{{/unless}}>
```

Standard Schema:
```json
{
  "$schema": "http://json-schema.org/schema#",
  "type": "object",
  "properties": {
    "tag": {
      "type": "string"
    },
    "href": {
      "type": "string"
    },
    "disabled": {
      "type": "string"
    },
    "modifier": {
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

Condensed schema:
```json
{
  "properties": ["tag", "href", "disabled", "modifier", "iconName", "iconClasses", "text"],
  "required": ["text"],
  "dependencies": {
    "iconClasses": ["iconName"]
  }
}
```

### Badge component
Template:
```handlebars
<figure class="Badge{{#if modifier}} {{ modifier }}{{/if}}">
    <img class="Badge-image" src="http://placehold.it/365x365" alt="Profile">
    <figcaption class="Badge-caption">
    	{{#if quote}}<blockquote class="Badge-quote">{{quote}}</blockquote>{{/if}}
        {{#if pill}}{{> @pill pill}}{{/if}}
        <h1 class="Badge-label Headline Headline--tertiary">{{#if url}}<a href="{{url}}">{{/if}}{{ title }}{{#if url}}</a>{{/if}}</h1>
        {{#if subTitle}}<h2 class="Badge-subLabel">{{{subTitle}}}</h2>{{/if}}
    </figcaption>
</figure>
```

Standard Schema:
```json
```

Condensed schema:
```json
```
