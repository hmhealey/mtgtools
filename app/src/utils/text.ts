export function snakeToTitleCase(str: string) {
    return str
        .split('_')
        .map((part) => part[0].toUpperCase() + part.substring(1))
        .join();
}
