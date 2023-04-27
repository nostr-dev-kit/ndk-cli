import NDK from '@nostr-dev-kit/ndk';

export interface IProfileOpts {
    npub: string;
};

export default async function profile(ndk: NDK, opts: IProfileOpts) {
    const {npub} = opts;
    console.log('get user 1');

    const user = ndk.getUser({ npub });
    const promise1 = user.fetchProfile();

    console.log('get user 2');
    const user2 = ndk.getUser({ npub: 'npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc' });
    const promise2 = user2.fetchProfile();

    const b = ndk.subscribe({
        kinds: [1],
        authors: ['fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52']
    });

    const a = await Promise.all([
        promise1,
        promise2,
        b
    ]);

    // console.log(a);


    // console.log(user.profile);
    // console.log(user2.profile);
    process.exit(0);
}