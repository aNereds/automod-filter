import ru from '../data/ru.json';
import en from '../data/en.json';
import lv from '../data/lv.json';
import { AutomodOptions, AutomodReply } from '../interfaces';

export enum Lang {
  ENGLISH = 'en',
  RUSSIAN = 'ru',
  LATVIAN = 'lv',
}
export enum Method {
  CLASSIC,
  STRICT,
}

export class Filter {
  readonly defaultOpts: AutomodOptions = {
    langs: [Lang.ENGLISH],
    replacer: '█',
    method: Method.CLASSIC,
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private readonly methods: Map<Method, Function> = new Map();

  constructor() {
    this.methods
      .set(Method.CLASSIC, (word: string, langs: Lang[]): [string, boolean] => {
        if (
          langs.includes(Lang.RUSSIAN) &&
          !ru.exclude.includes(word) &&
          ru.include.filter((w) => word === w || word.includes(w)).length != 0
        ) {
          return [Lang.RUSSIAN, true];
        }
        if (
          langs.includes(Lang.ENGLISH) &&
          !en.exclude.includes(word) &&
          en.include.filter((w) => word === w || word.includes(w)).length != 0
        ) {
          return [Lang.ENGLISH, true];
        }

        if (
          langs.includes(Lang.LATVIAN) &&
          !lv.exclude.includes(word) &&
          lv.include.filter((w) => word === w || word.includes(w)).length != 0
        ) {
          return [Lang.LATVIAN, true];
        }
        return ['', false];
      })
      .set(Method.STRICT, (word: string, langs: Lang[]): [string, boolean] => {
        const results: boolean[] = [];
        if (langs.includes(Lang.RUSSIAN) && !ru.exclude.includes(word)) {
          if (
            ru.include.filter((w) => word === w || word.includes(w)).length != 0
          ) {
            return [Lang.RUSSIAN, true];
          }
          results.push(this.found(word, ru));
        }
        if (langs.includes(Lang.ENGLISH) && !en.exclude.includes(word)) {
          if (
            en.include.filter((w) => word === w || word.includes(w)).length != 0
          ) {
            return [Lang.ENGLISH, true];
          }
          results.push(this.found(word, en));
        }
        if (langs.includes(Lang.LATVIAN) && !lv.exclude.includes(word)) {
          if (
            lv.include.filter((w) => word === w || word.includes(w)).length != 0
          ) {
            return [Lang.LATVIAN, true];
          }
          results.push(this.found(word, lv));
        }

        return ['', results.includes(true)];
      });
  }

  /**
   * @param  { string } string Query string to filter
   * @param  { AutomodOptions } options Filter options { langs: Lang[], replacer: "█", method: Method }
   * @returns { AutomodReply } Output data { clean: boolean, output: string, ... }
   */
  filter(
    string: string = '',
    options: AutomodOptions = this.defaultOpts,
  ): AutomodReply {
    const { langs, replacer, method } = { ...this.defaultOpts, ...options };
    let reply: AutomodReply = {
      time: Date.now(),
      input: string,
      output: string,
      matches: [],
      involvedLanguages: [],
      clean: true,
    };
    reply = this.clean(reply, { langs, replacer, method });
    reply.time = Date.now() - reply.time;
    return reply;
  }

  private clean(reply: AutomodReply, options: AutomodOptions): AutomodReply {
    const isProfane = this.methods.get(options.method);
    for (const word of reply.output.split(/ /)) {
      const [language, result] = isProfane
        ? isProfane(word, options.langs)
        : ['', false];
      if (result) {
        reply.matches.push(word);
        reply.clean = false;
        reply.output = reply.output.replace(
          word,
          options.replacer.repeat(word.length),
        );

        if (language && !reply.involvedLanguages.includes(language)) {
          reply.involvedLanguages.push(language);
        }
      }
    }

    return reply;
  }

  private found(string: string, lang: any, index: number = 0): boolean {
    const replacers: string[] | undefined =
      lang.replacers[string.charAt(index)];
    if (replacers) {
      const results: boolean[] = [];
      for (let i = 0; i < replacers.length; i++) {
        const newString = string.replace(string.charAt(index), replacers[i]);
        if (
          lang.include.filter(
            (w: string) => newString === w || newString.includes(w),
          ).length != 0
        ) {
          return true;
        }
        if (index + 1 == string.length) {
          return false;
        } else {
          results.push(this.found(newString, lang, index + 1));
        }
      }
      return results.includes(true);
    } else {
      if (index + 1 == string.length) {
        return false;
      } else {
        return this.found(string, lang, index + 1);
      }
    }
  }
}
