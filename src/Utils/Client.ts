export async function retryFetch(
  url: string | URL,
  options: RequestInit = {},
  retries: number = 3,
  delay: number = 1000,
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      const isRetryableError = error instanceof TypeError ||
        (error.message.includes("timeout") ||
          error.message.includes("connection error"));

      if (!isRetryableError || attempt >= retries - 1) {
        console.error(
          `All ${retries} attempts failed due to error: ${error.message}`,
        );
        throw error;
      }

      console.warn(
        `Fetch attempt ${
          attempt + 1
        } failed with error: ${error.message}. Retrying...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Failed to fetch after retries");
}
