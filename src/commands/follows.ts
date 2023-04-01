import NDK from '@nostr-dev-kit/ndk';

export interface IFollowsOpts {
    npub: string;
    fetchProfile: boolean;
};

export default async function follows(ndk: NDK, opts: IFollowsOpts) {
    const {npub, fetchProfile} = opts;
    const user = ndk.getUser({ npub });

    const follows = await user.follows();

    for (let follow of follows) {
        if (fetchProfile) {
            await follow.fetchProfile();
            console.log(follow.profile?.name || follow.npub);
        } else {
            console.log(follow.npub);
        }
    }

    console.log(`Total follows: ${follows.size}`);

    process.exit(0);
}