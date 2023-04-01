#!/usr/bin/env node

import yargs, { boolean } from 'yargs';
import { hideBin } from 'yargs/helpers';
import profile from './commands/profile';
import follows from './commands/follows';
import NDK, { NDKConstructorParams } from '@nostr-dev-kit/ndk';
import NDKRedisCacheAdapter from '@nostr-dev-kit/ndk-cache-redis';

const defaultRelays = ['wss://nos.lol'];

async function createNDK(
    relays: string[],
    cache: boolean
): Promise<NDK> {
    const ndkOpts: NDKConstructorParams = {};

    if (cache) {
        ndkOpts.cacheAdapter = new NDKRedisCacheAdapter({
            expirationTime: 3600,
        });
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
    .command('follows <npub>', 'get follows for an npub', (yargs) => {
        yargs.option('profile', {
            alias: 'p',
            type: 'boolean',
            description: 'Fetch profiles for follows'
        });
    }, async (argv) => {
        const relays = argv.relays || defaultRelays;
        const cache = argv.redis || false;
        const fetchProfile = argv.profile || false;
        const ndk = await createNDK(relays as string[], cache as boolean);
        follows(ndk, {npub: argv.npub as string, fetchProfile: fetchProfile as boolean});
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

