#!/usr/bin/env node

import yargs, { boolean } from 'yargs';
import { hideBin } from 'yargs/helpers';
import profile from './commands/profile';
import follows from './commands/follows';
import query from './commands/query';
import NDK, { NDKConstructorParams } from '@nostr-dev-kit/ndk';
import NDKRedisCacheAdapter from '@nostr-dev-kit/ndk-cache-redis';
import * as dotenv from 'dotenv';
dotenv.config();

let defaultRelays = ['wss://nos.lol'];

if (process.env.RELAYS) {
    defaultRelays = process.env.RELAYS.split(',');
}

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

    .command('query <query>', 'run a query', (yargs) => {}, async (argv) => {
        const relays = argv.relays || defaultRelays;
        const cache = argv.redis || false;
        const ndk = await createNDK(relays as string[], cache as boolean);
        query(ndk, {query: JSON.parse(argv.query as string)});
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

