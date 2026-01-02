import { defaultPool } from "./buffer-pool";
import { encodeTime, encodeRandom } from "./encoding";

export interface IdConfig{
    length?: number;
}

// Defaults
const DEFAULT_LENGTH = 20;
const TIME_LEN = 8;

/**
 * generate
 * Creates a unique, time-sortable ID.
 * * Format: [Timestamp (8 chars)] + [Randomness (12 chars)]
 * Example: "001iU5yV" + "9b2n5k1lX0z" -> "001iU5yV9b2n5k1lX0z"
 * @param config Optional configuration object
 */
export function sortid(config?: IdConfig): string{
    const totalLength = config?.length || DEFAULT_LENGTH;

    if(totalLength <= TIME_LEN){
        throw new Error(`Sortable ID length must be > ${TIME_LEN} characters to ensure uniqueness.`);
    }

    const randomLen = totalLength - TIME_LEN;

    // 1. Time Component (Sortability)
    const timePart = encodeTime(Date.now(), TIME_LEN);

    // 2. Random Component (Uniqueness)
    const randomBytes = defaultPool.next(randomLen);
    const randomPart = encodeRandom(randomBytes, randomLen);

    return timePart + randomPart;
}

/**
 * Generates a high-entropy random string.
 * Structure: [Randomness (N chars)]
 * @param length Total length of the ID (default: 21)
 */
export function randomid(length: number = 21): string{
    const bytes = defaultPool.next(length);
    return encodeRandom(bytes, length);
}

export default sortid;