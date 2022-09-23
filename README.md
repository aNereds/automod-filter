# automod-filter

A javascript filter for badwords

[![Build Status](https://travis-ci.com/idaspin/automod-filter.svg?branch=master)](https://travis-ci.com/idaspin/automod-filter)

## Installation

    npm install automod-filter --save

## Usage

```js
const { Automod } = require('automod-filter');

console.log(Automod.filter("What the fuck is going on here? Whore" })) // What the ████ is going on here? █████
```

### Options

```js
const { Automod, Lang, Method } = require('./lib/index.js');

console.log(Automod.filter("d@mn а я fuck не понял 6ля что вы shit делаете whore в холодильнике cуk@", { langs: [ Lang.ENGLISH ], method: Method.CLASSIC } ));
// {
//     input: 'd@mn а я fuck не понял 6ля что вы shit делаете whore в холодильнике cуk@',      
//     output: 'd@mn а я ████ не понял 6ля что вы ████ делаете █████ в холодильнике cуk@'
//     matches: [ 'fuck', 'Whore' ]
// }

console.log(Automod.filter("d@mn а я fuck не понял 6ля что вы shit делаете whore в холодильнике cуk@", { langs: [ Lang.ENGLISH, Lang.RUSSIAN ], method: Method.STRICT, replacer: "*" }));
// {
//     input: 'd@mn а я fuck не понял 6ля что вы shit делаете whore в холодильнике cуk@',      
//     output: '**** я **** не понял *** что вы **** делаете ***** в холодильнике ****',     
//     matches: [ 'd@mn', 'fuck', '6ля', 'shit', 'whore', 'cуk@' ]
// }
```

### TODO
- Regex search
- Fill English replacers
- URL parser

### Community

- Found a bug: [submit an issue.](https://github.com/idaspin/automod-filter/issues/new)
- Discussion and help about automod-filter: [🇷🇺 Discord Server](https://discord.gg/YeqrTtpmaH)
