import NDK from '@nostr-dev-kit/ndk';
import type { NDKFilter, NDKEvent } from '@nostr-dev-kit/ndk';

export interface IQueryOpts {
    query: NDKFilter;
};

export default async function query(ndk: NDK, opts: IQueryOpts) {
    const {query} = opts;
    const sub = await ndk.subscribe(query);

    sub.on('event', (event: NDKEvent) => {
        console.log(event.rawEvent());
    });

    sub.on('eose', () => {
        console.log('EOSE');
    });
};