import { sortid, randomid } from '../src/index';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

console.log("Benchmark");
console.log("-----------------------------------------------");

const ITERATIONS = 100_000;

function run(label: string, fn: () => string) {
    const start = process.hrtime.bigint();

    for(let i = 0; i < ITERATIONS; i++){
        fn();
    }

    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1e6;
    const ops = Math.floor((ITERATIONS / ms) * 1000).toLocaleString();

    console.log(`${label.padEnd(10)}: ${ops} ops/sec`);
}

// Warmup
sortid(); randomid(21);

console.log("Category 1: Database Keys (Sortable/Unique)");
run("uuid", () => uuidv4());
run("ksort-id", () => sortid()); 

console.log("\nCategory 2: URL / Token Generation (Pure Random)");
run("nanoid", () => nanoid());
run("ksort-id", () => randomid(21));