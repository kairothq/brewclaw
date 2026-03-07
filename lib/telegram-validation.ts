const TELEGRAM_API_BASE = "https://api.telegram.org/bot";
const TIMEOUT_MS = 10000; // 10 second timeout

interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

/**
 * Validate a Telegram bot token using the getMe endpoint
 */
export async function validateBotToken(token: string): Promise<ValidationResult> {
  // Basic format check: token should be like "123456789:ABCdefGHI..."
  if (!token || !token.includes(":")) {
    return { valid: false, error: "Invalid token format. Should be like 123456789:ABCdefGHI..." };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${token}/getMe`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json();

    if (data.ok) {
      // Token is valid, return bot info
      return {
        valid: true,
        data: {
          botId: data.result.id,
          botUsername: data.result.username,
          botName: data.result.first_name,
        }
      };
    } else {
      // API returned error
      if (data.error_code === 401) {
        return { valid: false, error: "Invalid bot token. Please check and try again." };
      }
      return { valid: false, error: data.description || "Validation failed" };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { valid: false, error: "Validation timed out. Please try again." };
      }
      return { valid: false, error: `Network error: ${error.message}` };
    }
    return { valid: false, error: "Unknown error occurred" };
  }
}

/**
 * Validate a Telegram user ID
 *
 * User IDs are numeric and positive. We can optionally verify the bot
 * can reach this user by attempting to send a message (requires valid bot token).
 */
export async function validateUserId(
  userId: string,
  botToken?: string
): Promise<ValidationResult> {
  // Basic format check: should be numeric
  const numericId = parseInt(userId, 10);
  if (isNaN(numericId) || numericId <= 0) {
    return { valid: false, error: "User ID must be a positive number" };
  }

  // If no bot token provided, just validate format
  if (!botToken) {
    return { valid: true };
  }

  // With bot token, verify bot can reach user via getChat
  // (getChat is less intrusive than sendMessage)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${botToken}/getChat?chat_id=${numericId}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json();

    if (data.ok) {
      return {
        valid: true,
        data: {
          firstName: data.result.first_name,
          username: data.result.username,
        }
      };
    } else {
      // User might not have started conversation with bot yet
      if (data.error_code === 400) {
        // Chat not found - user hasn't started conversation with bot
        // This is still a valid user ID format, just not reachable yet
        // We'll treat this as valid since the user can start the conversation later
        return {
          valid: true,
          data: { note: "Bot cannot reach user yet. User needs to send /start to the bot first." }
        };
      }
      return { valid: false, error: data.description || "Could not verify user ID" };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { valid: false, error: "Validation timed out. Please try again." };
      }
    }
    // On network error, accept valid format
    return { valid: true };
  }
}
