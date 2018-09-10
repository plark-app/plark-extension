export function copyToClipboard(input: HTMLInputElement | HTMLTextAreaElement): Promise<void> {
    input.select();

    try {
        let successful = document.execCommand('copy');
        // @TODO There is no way to keep it here.. Should be other way.
        if (successful) {
            return Promise.resolve();
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
