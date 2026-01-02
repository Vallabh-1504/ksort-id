const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * encodeTime
 * Converts a numeric timestamp into a Base62 string.
 * Ensures the ID starts with the time, making it sortable.
 * @param now The current timestamp (Date.now())
 * @param length The fixed length for the time component (padding)
 */
export function encodeTime(now: number, length: number): string{
    let str = '';
    let time = now;

    while(time > 0){
        const mod = time % 62;
        str = ALPHABET[mod] + str;
        time = Math.floor(time / 62);
    }

    return str.padStart(length, '0');
}

/**
 * encodeRandom
 * Converts raw random bytes into a Base62 string.
 * @param buffer The buffer from our RandomPool
 * @param length The target length of the random string
 */
export function encodeRandom(buffer: Buffer, length: number): string{
    let str = '';

    // Iterate through buffer to map bytes to characters
    // Optimization: Use the simplest mapping (byte % 62).
    for(let i = 0; i < length; i++){
        const index = buffer[i] % 62;
        str += ALPHABET[index];
    }

    return str;
}