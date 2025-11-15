import { describe, expect, it } from 'vitest';
import { mod } from '../util';

describe('mod', () => {
    it('returns a mod b', () => {
        expect(mod(2, 3)).toBe(2);
        expect(mod(3, 2)).toBe(1);
        expect(mod(13, 11)).toBe(2);
    });
});
