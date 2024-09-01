import { assertEquals, assertThrows } from "@std/assert";
import { EnvConfig } from "./EnvConfig.ts";
import { ServerConfigurationException } from "../exceptions/ServerConfigurationException.ts";

Deno.test("EnvConfig.getEnvVar returns the correct environment variable", () => {
  // Arrange
  const varName = "TEST_VAR";
  const expectedValue = "test_value";
  Deno.env.set(varName, expectedValue);

  // Act
  const result = EnvConfig.getEnvVar(varName);

  // Assert
  assertEquals(result, expectedValue);
});

Deno.test("EnvConfig.getEnvVar throws ServerConfigurationException for missing variable", () => {
  // Arrange
  const varName = "MISSING_VAR";

  // Act & Assert
  assertThrows(
    () => {
      EnvConfig.getEnvVar(varName);
    },
    ServerConfigurationException,
    `Missing environment variable: ${varName}`,
  );
});

Deno.test("EnvConfig.getIntEnvVar returns the correct integer environment variable", () => {
  // Arrange
  const varName = "INT_VAR";
  const expectedValue = 42;
  Deno.env.set(varName, expectedValue.toString());

  // Act
  const result = EnvConfig.getIntEnvVar(varName);

  // Assert
  assertEquals(result, expectedValue);
});

Deno.test("EnvConfig.getIntEnvVar throws ServerConfigurationException for missing variable", () => {
  // Arrange
  const varName = "MISSING_INT_VAR";

  // Act & Assert
  assertThrows(
    () => {
      EnvConfig.getIntEnvVar(varName);
    },
    ServerConfigurationException,
    `Missing environment variable: ${varName}`,
  );
});

Deno.test("EnvConfig.getIntEnvVar throws error when non-integer value is provided", () => {
  // Arrange
  const varName = "NON_INT_VAR";
  Deno.env.set(varName, "non-integer");

  // Act & Assert
  assertThrows(
    () => {
      EnvConfig.getIntEnvVar(varName);
    },
    Error,
  );
});
