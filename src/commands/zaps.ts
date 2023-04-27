import NDK, { NDKUser } from '@nostr-dev-kit/ndk';
import type { NDKFilter, NDKEvent } from '@nostr-dev-kit/ndk';
import { zapInvoiceFromEvent } from '@nostr-dev-kit/ndk';

export interface IQueryOpts {
    npub: string;
    closeOnEose: boolean;
};

export default async function zaps(ndk: NDK, opts: IQueryOpts) {
    const {npub} = opts;
    const user = new NDKUser({npub});
    const filter: NDKFilter = {
        kinds: [9735],
        '#p': [user.hexpubkey()]
    };
    const sub = ndk.subscribe(filter, { closeOnEose: opts.closeOnEose });

    sub.on('event', async (event: NDKEvent) => {
        try {
            const zap = zapInvoiceFromEvent(event);

            if (!zap) return;

            const {zappee, amount, comment} = zap;
            const time = new Date(event.created_at!*1000).toLocaleString();
            const commentString = comment ? ` (${comment})` : '';
            const zappeeUser = ndk.getUser({hexpubkey: zappee});
            await zappeeUser.fetchProfile();
            const zappeeName = zappeeUser.profile?.displayName || zappeeUser.npub;

            console.log(`[${time}] ${zappeeName} zapped ${amount} sats${commentString}`);
        } catch (e) {
            console.log(`error:`, e);
        }
    });
};
