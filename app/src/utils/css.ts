export type ClassName = ClassNameElement[];
export type ClassNameElement = string | ClassNameElement[] | Record<string, boolean | null | undefined>;

export function classNames(...args: ClassName): string {
    let className = '';

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (typeof arg === 'string') {
            const separator = className ? ' ' : '';
            className += separator + arg;
        } else if (Array.isArray(arg)) {
            const separator = className ? ' ' : '';
            className += separator + classNames(...arg);
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
