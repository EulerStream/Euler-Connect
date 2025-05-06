import {config} from '@dotenvx/dotenvx';
import * as process from "node:process";
import fs from "node:fs";

let paths = [`${import.meta.dirname}/../../../../.env`];

if (process.env.CLI_CEB_DEV === 'true' || process.env.__DEV__ === 'true') {
  paths = [...paths, `${import.meta.dirname}/../../../../.env.development`];
} else {
  paths = [...paths, `${import.meta.dirname}/../../../../.env.production`];
  fs.writeFileSync(`/Users/isaackogan/Desktop/test3`, JSON.stringify(process.env));
}

export const baseEnv =
    config({
      path: paths,
    }).parsed ?? {};

export const dynamicEnvValues = {
  CEB_NODE_ENV: baseEnv.CEB_DEV === 'true' ? 'development' : 'production',
} as const;
