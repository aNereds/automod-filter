const { Automod, Lang, Method } = require('./lib/index.js');

console.log(Automod.filter("d@mn а я fuck не понял 6ля что вы shit делаете whore в холодильнике cуk@", { langs: [ Lang.ENGLISH ] }))
console.log(Automod.filter("d@mn а я fuck не понял 6ля что вы shit делаете whore в pidars холодильнике cуk@ сабля, манда мандарин bāba", { langs: [ Lang.ENGLISH, Lang.RUSSIAN, Lang.LATVIAN ], method: Method.STRICT }))