import * as abbrev from 'abbrev';
import { UnsupportedOptionCombinationError, CustomError } from '../lib/errors';

interface ModeData {
  allowedCommands: Array<string>;
  config: (args) => [];
}

const modes: Record<string, ModeData> = {
  container: {
    allowedCommands: ['test', 'monitor'],
    config: (args): [] => {
      args['docker'] = true;

      return args;
    },
  },
};

export function parseMode(mode: string, args): string {
  if (isValidMode(mode)) {
    const command: string = args._[0];

    if (isValidCommand(mode, command)) {
      configArgs(mode, args);
      mode = args._.shift();
    }
  }

  return mode;
}

export function modeValidation(args: object) {
  const mode = args['command'];
  const commands: Array<string> = args['options']._;

  if (isValidMode(mode) && commands.length <= 1) {
    const allowed = modes[mode].allowedCommands
      .join(', ')
      .replace(/, ([^,]*)$/, ' or $1');
    const message = `use snyk ${mode} with ${allowed}`;

    throw new CustomError(message);
  }

  const command = commands[0];
  if (isValidMode(mode) && !isValidCommand(mode, command)) {
    const notSupported = [mode, command];

    throw new UnsupportedOptionCombinationError(notSupported);
  }
}

function isValidMode(mode: string): boolean {
  return Object.keys(modes).includes(mode);
}

function isValidCommand(mode: string, command: string): boolean {
  const aliases = abbrev(modes[mode].allowedCommands);

  return Object.keys(aliases).includes(command);
}

function configArgs(mode: string, args): [] {
  return modes[mode].config(args);
}
