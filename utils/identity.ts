/**
 * Centralized Entity ID Normalization & Scope Boundary Helper
 */

const ENTITY_ALIAS_MAP: Record<string, string> = {
  ret_001: 'RET001',
  ret_002: 'RET002',
  ret_003: 'RET003',
  ret_004: 'RET004',
  ret_005: 'RET005',
  dst_001: 'DST001',
  dst_002: 'DST002',
  dst_003: 'DST003',
  dst_004: 'DST004',
  dst_005: 'DST005',
  md_001: 'MD001',
  md_002: 'MD002',
};

/**
 * Normalizes an entity ID or code to its canonical string representation.
 */
export function normalizeEntityId(id?: string | null): string {
  if (!id) return '';
  const clean = id.trim();
  const lower = clean.toLowerCase();

  if (ENTITY_ALIAS_MAP[lower]) {
    return ENTITY_ALIAS_MAP[lower];
  }

  return clean;
}

/**
 * Checks if two entity IDs or codes represent the exact same business entity.
 */
export function entityIdsEqual(idA?: string | null, idB?: string | null): boolean {
  if (!idA || !idB) return false;
  const normA = normalizeEntityId(idA);
  const normB = normalizeEntityId(idB);
  return normA.toUpperCase() === normB.toUpperCase();
}
