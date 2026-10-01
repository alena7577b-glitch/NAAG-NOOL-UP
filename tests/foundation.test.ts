/**
 * NAAG NOOL UP — Foundation Architectural Verification Tests
 */

import { colors } from '../config/tokens';
import { locales, getDirection } from '../config/i18n';
import { communitySignupSchema } from '../lib/validation/schemas';

describe('Phase 1 Foundation Verification', () => {
  test('Design Token Palette contains required brand colors', () => {
    expect(colors.terracotta).toBe('#B85233');
    expect(colors.sand).toBe('#F9F6F0');
    expect(colors.dusk).toBe('#1E1C1A');
    expect(colors.sage).toBe('#4D5844');
    expect(colors.amber).toBe('#D49B4B');
  });

  test('i18n supports Arabic with RTL layout direction', () => {
    expect(locales).toContain('ar');
    expect(getDirection('ar')).toBe('rtl');
    expect(getDirection('en')).toBe('ltr');
  });

  test('Validation schema rejects invalid community email', () => {
    const result = communitySignupSchema.safeParse({
      fullName: 'Test User',
      email: 'invalid-email',
    });
    expect(result.success).toBe(false);
  });
});
