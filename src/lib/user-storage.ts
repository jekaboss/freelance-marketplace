export function getUserScopedKey(baseKey: string, userId?: number | null): string {
  return userId ? `${baseKey}:user:${userId}` : baseKey;
}

export function getUserScopedItem(baseKey: string, userId?: number | null): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const scopedKey = getUserScopedKey(baseKey, userId);
  const scopedValue = localStorage.getItem(scopedKey);
  if (scopedValue !== null) {
    return scopedValue;
  }

  // Fallback for old unscoped keys.
  return localStorage.getItem(baseKey);
}

export function setUserScopedItem(baseKey: string, value: string, userId?: number | null): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(getUserScopedKey(baseKey, userId), value);
}

export function removeUserScopedItem(baseKey: string, userId?: number | null): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(getUserScopedKey(baseKey, userId));
  localStorage.removeItem(baseKey);
}
