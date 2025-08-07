export function safeGet(obj: any, path: string, defaultValue: any = undefined): any {
    try {
      // Split 'user.profile.name' into ['user', 'profile', 'name'] and traverse
      return path.split('.').reduce((current, key) => {
        if (current && typeof current === 'object' && key in current) {
          return (current as Record<string, any>)[key];
        }
        return undefined;
      }, obj) ?? defaultValue;
    } catch {
      // Return default if any part of traversal fails
      return defaultValue;
    }
  }

 export function safeGetArray(obj: any, path: string): any[] {
    const result = safeGet(obj, path);
    return Array.isArray(result) ? result : [];
  }