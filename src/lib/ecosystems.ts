import * as cppPlugin from 'snyk-cpp-plugin';
import { TestOptions, Options } from './types';
import { TestCommandResult } from '../cli/commands/types';
import { MethodArgs } from '../cli/args';

interface ScannedArtifact {
  type:
    | 'depTree'
    | 'depGraph'
    | 'callGraph'
    | 'manifestFile'
    | 'binaries'
    | 'hashes'
    | 'dockerLayers'
    | 'cpp-fingerprints';
  data: any;
  meta?: { [key: string]: any };
}

export interface EcosystemPlugin {
  scan: (dir: string) => Promise<ScannedArtifact>;
}

export type Ecosystem = 'cpp';

const EcosystemPlugins: {
  readonly [ecosystem in Ecosystem]: EcosystemPlugin;
} = {
  cpp: cppPlugin,
};

export function getPlugin(ecosystem: Ecosystem): EcosystemPlugin  {
  return EcosystemPlugins[ecosystem];
}

export function getEcosystem(options: Options & TestOptions): Ecosystem | null {
  if (options.depSourceDir) {
    return 'cpp';
  }
  return null;
}

export async function testEcosystem(args: MethodArgs): Promise<TestCommandResult> {
  // const plugin = getPlugin(ecosystem);
  // const scan = plugin.scan(dir);
  // const results = await test(scan);
  // const display = plugin.display(results);
  return TestCommandResult.createHumanReadableTestCommandResult(
    'display',
    'json',
  );
}