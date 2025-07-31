interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  keyPrefix: string;
}

class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private getKey(identifier: string): string {
    return `${this.config.keyPrefix}_${identifier}`;
  }

  private getAttempts(key: string): { count: number; firstAttempt: number } {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return { count: 0, firstAttempt: Date.now() };
    }

    try {
      return JSON.parse(stored);
    } catch {
      return { count: 0, firstAttempt: Date.now() };
    }
  }

  private setAttempts(key: string, attempts: { count: number; firstAttempt: number }): void {
    localStorage.setItem(key, JSON.stringify(attempts));
  }

  private clearAttempts(key: string): void {
    localStorage.removeItem(key);
  }

  canAttempt(identifier: string): { allowed: boolean; remainingTime?: number; message?: string } {
    const key = this.getKey(identifier);
    const attempts = this.getAttempts(key);
    const now = Date.now();

    // Check if the window has expired
    if (now - attempts.firstAttempt > this.config.windowMs) {
      // Reset the window
      this.clearAttempts(key);
      return { allowed: true };
    }

    // Check if we've exceeded the limit
    if (attempts.count >= this.config.maxAttempts) {
      const remainingTime = this.config.windowMs - (now - attempts.firstAttempt);
      const remainingMinutes = Math.ceil(remainingTime / 60000);
      return {
        allowed: false,
        remainingTime,
        message: `Too many attempts. Please wait ${remainingMinutes} minute(s) before trying again.`
      };
    }

    return { allowed: true };
  }

  recordAttempt(identifier: string): void {
    const key = this.getKey(identifier);
    const attempts = this.getAttempts(key);
    const now = Date.now();

    // If this is a new window, reset
    if (now - attempts.firstAttempt > this.config.windowMs) {
      this.setAttempts(key, { count: 1, firstAttempt: now });
    } else {
      // Increment the count
      this.setAttempts(key, { count: attempts.count + 1, firstAttempt: attempts.firstAttempt });
    }
  }

  reset(identifier: string): void {
    const key = this.getKey(identifier);
    this.clearAttempts(key);
  }
}

// Create rate limiters for different operations
export const signupRateLimiter = new RateLimiter({
  maxAttempts: 1, // Only allow 1 attempt
  windowMs: 2 * 60 * 1000, // 2 minutes window
  keyPrefix: 'signup_attempts'
});

export const authRateLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  keyPrefix: 'auth_attempts'
});
