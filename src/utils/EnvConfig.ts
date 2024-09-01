import { ServerConfigurationException } from "../exceptions/ServerConfigurationException.ts";

export class EnvConfig {
  static getEnvVar(varName: string) {
    const envVar = Deno.env.get(varName);
    if (!envVar) {
      throw new ServerConfigurationException(
        `Missing environment variable: ${varName}`,
      );
    }
    return envVar;
  }

  static getIntEnvVar(varName: string) {
    const value = parseInt(EnvConfig.getEnvVar(varName));
    if (isNaN(value)) {
      throw new Error(`Invalid integer: ${value}`);
    }
    return value;
  }
}
