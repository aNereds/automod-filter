import { Lang, Method } from './structures/Filter';

interface AutomodReply {
  time: number;
  input: string;
  output: string;
  matches: string[];
  involvedLanguages: string[];
  clean: boolean;
}

interface AutomodOptions {
  langs: Lang[];
  replacer: string;
  method: Method;
}
