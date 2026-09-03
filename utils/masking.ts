const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'apikey',
  'authorization',
  'accountnumber',
  'cardnumber',
  'cvv',
  'otp',
  'pin',
  'signaturekey',
  'clientsecret',
  'bearertoken',
];

/**
 * Mask a sensitive string value.
 */
export function maskSecret(val: string): string {
  if (!val) return '••••••••••••';
  const str = String(val).trim();
  if (str.length <= 4) return '••••••••';
  return `••••••••${str.slice(-4)}`;
}

export function maskBankAccount(accountNumber: string): string {
  if (!accountNumber) return '••••••••';
  const cleaned = accountNumber.trim();
  if (cleaned.length <= 4) return '••••••••';
  return `••••••••${cleaned.slice(-4)}`;
}

export function maskApiKey(apiKey: string): string {
  if (!apiKey) return '••••••••';
  const cleaned = apiKey.trim();
  if (cleaned.length <= 4) return '••••••••';
  return `••••••••${cleaned.slice(-4)}`;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '••••••••';
  const cleaned = phone.trim();
  if (cleaned.length <= 4) return '••••••••';
  return `••••••${cleaned.slice(-4)}`;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '••••@••••.com';
  const [name, domain] = email.split('@');
  const maskedName = name.length > 2 ? `${name[0]}••••${name[name.length - 1]}` : '••••';
  return `${maskedName}@${domain}`;
}

export function maskPan(pan: string): string {
  if (!pan) return '••••••••••';
  const cleaned = pan.trim();
  if (cleaned.length < 10) return '••••••••••';
  return `${cleaned.slice(0, 5)}••••${cleaned.slice(-1)}`;
}

export function maskGst(gstin: string): string {
  if (!gstin) return '•••••••••••••••';
  const cleaned = gstin.trim();
  if (cleaned.length < 15) return '•••••••••••••••';
  return `${cleaned.slice(0, 2)}•••••••••••${cleaned.slice(-2)}`;
}

/**
 * Sanitize HTTP headers map.
 */
export function sanitizeHeaders(headers?: Record<string, string>): Record<string, string> {
  if (!headers) return {};
  const clean: Record<string, string> = {};
  Object.entries(headers).forEach(([key, val]) => {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('auth') ||
      lowerKey.includes('key') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('token') ||
      lowerKey.includes('cookie')
    ) {
      clean[key] = lowerKey.includes('bearer') ? 'Bearer ••••••••••••' : maskSecret(val);
    } else {
      clean[key] = val;
    }
  });
  return clean;
}

/**
 * Recursively sanitize JSON payload objects.
 */
export function sanitizeJsonPayload<T = unknown>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeJsonPayload(item)) as T;
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    Object.entries(obj as Record<string, unknown>).forEach(([key, val]) => {
      const lowerKey = key.toLowerCase();
      const isSensitive = SENSITIVE_KEYS.some((s) => lowerKey.includes(s));

      if (isSensitive && typeof val === 'string') {
        result[key] = maskSecret(val);
      } else if (typeof val === 'object' && val !== null) {
        result[key] = sanitizeJsonPayload(val);
      } else {
        result[key] = val;
      }
    });
    return result as T;
  }

  return obj;
}
