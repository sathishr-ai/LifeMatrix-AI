import { performance } from 'perf_hooks';
import crypto from 'crypto';

async function runAggressiveUniqueLoadTests() {
    console.log("📈 Starting Aggressive Hardware CPU Thrashing (Absolute Unique Hashing)...");

    let passCount = 0;
    const TARGET = 300;
    const LATENCY_THRESHOLD_MS = 500;
    let generatedHashes = new Set();

    try {
        console.log("\n⚡ [PHASE 1] Cryptographic Core Saturation Protocol...");
        console.log(`Checking strict bounds latency: <${LATENCY_THRESHOLD_MS}ms per unique calculation thread`);

        for (let i = 1; i <= TARGET; i++) {
            // Generating entirely distinct string payloads to guarantee no V8 Cache repeats
            const uniquePayloadString = `LifeMatrix-AI-Payload-Data-${Math.random()}-${Date.now()}-${crypto.randomBytes(32).toString('hex')}`;

            if (!generatedHashes.has(uniquePayloadString)) {
                generatedHashes.add(uniquePayloadString);

                const cycleStart = performance.now();

                // Natively thrash the hashing logic against the unique payload String exclusively
                let output = '';
                for (let j = 0; j < 500; j++) {
                    const hasher = crypto.createHash('sha512');
                    hasher.update(uniquePayloadString + j.toString());
                    output = hasher.digest('hex');
                }

                const cycleEnd = performance.now();
                const latency = cycleEnd - cycleStart;

                if (latency < LATENCY_THRESHOLD_MS) {
                    passCount++;
                    if (passCount % 50 === 0) {
                        console.log(`✅ [Payload 0x${output.substring(0, 10)}...] resolved uniquely in ${latency.toFixed(2)}ms`);
                    }
                } else {
                    console.warn(`⚠️ [Payload ${i}] FAILED THRESHOLD: ${latency.toFixed(2)}ms`);
                }
            }
        }

        console.log(`\n===========================================`);
        console.log(`🎉 LOAD TESTING & CPU UNIQUE PERFORMANCE COMPLETE`);
        console.log(`🔥 TOTAL DISTINCT CRYPTO HASH THREADS: ${generatedHashes.size}`);
        console.log(`✅ PERFORMANCE TIMING PASSED: ${passCount}`);
        console.log(`===========================================`);

    } catch (err) {
        console.error("❌ Aggressive Load Test Execution Exploded:", err);
    }
}

runAggressiveUniqueLoadTests();
