type MaybeClassName = string | string[] | Record<string, boolean | null | undefined>;

export function classNames(...args: MaybeClassName[]): string {
    let className = '';

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (typeof arg === 'string') {
            const separator = className ? ' ' : '';
            className += separator + arg;
        } else if (Array.isArray(arg)) {
            const separator = className ? ' ' : '';
            className += separator + arg.join(' ');
        } else if (typeof arg === 'object') {
            for (const key of Object.keys(arg)) {
                if (arg[key]) {
                    const separator = className ? ' ' : '';
                    className += separator + arg;
                }
            }
        }
    }

    return className;
}
