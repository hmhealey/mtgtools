export function assert(value: unknown, message?: string): asserts value {
    if (value) {
        return;
    }

    if (message && typeof message === 'string') {
        throw new Error('Assertion failed: ' + message);
    } else {
        throw new Error('Assertion failed');
    }
}
