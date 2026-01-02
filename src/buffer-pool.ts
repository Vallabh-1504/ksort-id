import crypto from 'crypto';

/**
 * RandomPool
 * * systems-level optimization to reduce the overhead of 
 * cryptographic random number generation (CSPRNG).
 * * Strategy:
 * 1. Allocate a large contiguous Buffer (POOL_SIZE).
 * 2. Fill it with random bytes via a single system call.
 * 3. Serve requests by slicing this buffer and moving a pointer.
 * 4. Refill only when the pool is exhausted.
 */
export class RandomPool{
    private pool: Buffer;
    private pointer: number;
    private readonly size: number;

    constructor(size: number = 4096){
        this.size = size;
        this.pool = Buffer.allocUnsafe(size);
        this.pointer = size;
    }

    /**
     * Fills the buffer with new random bytes from the OS.
     */
    private refill(): void{
        crypto.randomFillSync(this.pool);
        this.pointer = 0;
    }

    /**
     * Takes n bytes of randomness from the pool.
     * @param length Number of bytes needed
     */
    public next(length: number): Buffer{
        if(length > this.size){
            return crypto.randomBytes(length);
        }

        if(this.pointer + length > this.size){
            this.refill();
        }

        const result = this.pool.subarray(this.pointer, this.pointer + length);
        this.pointer += length;

        return result;
    }
}

export const defaultPool = new RandomPool();