import {z} from "zod";

const coerceBoolean = () => z
    .string()
    .toLowerCase()
    .transform((x) => x === 'true')
    .pipe(z.boolean());

const ConfigSchema = z.object({});

export type _Config = z.infer<typeof ConfigSchema>;

function getEnv<T extends z.ZodRawShape>(prefix: string, schema: z.ZodObject<T>) {
  const shape = schema.shape;
  const parsed: any = {};

  for (const key in shape) {
    // @ts-ignore
    const envVar = import.meta.env[`VITE_PUBLIC_${prefix.toUpperCase()}_${key}`];
    if (envVar !== undefined) {
      parsed[key] = envVar;
    }
  }

  return schema.strip().parse(parsed);
}

export function loadConfig(): _Config {
  return {};
}


export const Config = loadConfig();