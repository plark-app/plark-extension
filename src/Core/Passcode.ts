export const MIN_PASSCODE_CHARS = 4;

export const validatePasscode = (passcode: string) => {
    if (!passcode) {
        throw Error('Please, fill in the form')
    }

    if (passcode.length < MIN_PASSCODE_CHARS) {
        throw Error(`Wrong format. Minimum ${MIN_PASSCODE_CHARS} characters`)
    }
};
