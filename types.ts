
export enum OutputType {
  LATEX = 'LATEX',
  TEXT = 'TEXT',
  ERROR = 'ERROR',
  HELP = 'HELP',
  IMAGE = 'IMAGE',
  GAME = 'GAME'
}

export interface TerminalLine {
  id: string;
  type: OutputType;
  content: string; // Raw latex or text message
  command?: string; // The original command typed
  timestamp: number;
  flags?: {
    download: boolean;
    copy: boolean;
    help: boolean;
    helpNav: boolean;
  };
}

export interface LatexSymbol {
  category: string;
  items: {
    label: string; // Display name or symbol
    code: string; // Latex code
  }[];
}

export interface ParsedCommand {
  raw: string;
  content: string;
  flags: {
    download: boolean;
    copy: boolean;
    help: boolean;
    helpNav: boolean;
  };
}

export interface TutorialLevel {
  id: number;
  taskEn: string;
  taskZh: string;
  expected: string[]; // Possible correct answers
  hintEn: string;
  hintZh: string;
}

export type Theme = 'dark' | 'light';
export type Language = 'en' | 'zh';
