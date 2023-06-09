import NDK from '@nostr-dev-kit/ndk';
import type { NDKFilter, NDKEvent } from '@nostr-dev-kit/ndk';

export interface IQueryOpts {
    query: NDKFilter;
};

export default async function query(ndk: NDK, opts: IQueryOpts) {
    const {query} = opts;
    const sub = ndk.subscribe(query, { closeOnEose: false });

    sub.on('event', (event: NDKEvent) => {
        console.log(JSON.stringify(event.rawEvent()));
    });

    sub.on('eose', () => {
        setTimeout(() => process.exit(0), 1000);
    });
};