import NDK from '@nostr-dev-kit/ndk';

export interface IProfileOpts {
    npub: string;
};

export default async function profile(ndk: NDK, opts: IProfileOpts) {
    const {npub} = opts;
    const user = ndk.getUser({ npub });
    await user.fetchProfile();

    console.log(user.profile);
    process.exit(0);
}