#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import profile from './commands/profile';
import NDK, { NDKConstructorParams } from '@nostr-dev-kit/ndk';
import NDKRedisCacheAdapter from '@nostr-dev-kit/ndk-cache-redis';

const defaultRelays = ['wss://nos.lol'];

async function createNDK(
    relays: string[],
    cache: boolean
): Promise<NDK> {
    const ndkOpts: NDKConstructorParams = {};

    if (cache) {
        ndkOpts.cacheAdapter = new NDKRedisCacheAdapter();
    }

    ndkOpts.explicitRelayUrls = relays || defaultRelays;

    const ndk = new NDK(ndkOpts);
    await ndk.connect();

    return ndk;
}

yargs(hideBin(process.argv))
    .command('profile <npub>', 'get profile data', () => {}, async (argv) => {
        const relays = argv.relays || defaultRelays;
        const cache = argv.redis || false;
        const ndk = await createNDK(relays as string[], cache as boolean);
        profile(ndk, {npub: argv.npub as string});
    })
    .option('relays', {
        alias: 'r',
        type: 'array',
        description: 'Relay URLs to use'
    })
    .option('redis', {
        type: 'boolean',
        description: 'Use redis for caching'
    })
    .demandCommand(1)
    .parse();

