export class ServerConfigurationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerConfigurationException";
  }
}
