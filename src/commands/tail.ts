import NDK from '@nostr-dev-kit/ndk';
import type { NDKFilter, NDKEvent } from '@nostr-dev-kit/ndk';

export interface IQueryOpts {
    query: NDKFilter;
};

export default async function query(ndk: NDK, opts: IQueryOpts) {
    const {query} = opts;
    query.since = Math.floor(Date.now() / 1000);
    const sub = ndk.subscribe(query, { closeOnEose: false });

    sub.on('event', (event: NDKEvent) => {
        console.log(`[${event.created_at}] ${event.content}`);
    });
};