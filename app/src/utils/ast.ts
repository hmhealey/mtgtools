export type Node<T = Record<never, string>> = T & {
    firstChild?: Node<T>;
    lastChild?: Node<T>;

    parent?: Node<T>;
    prevSibling?: Node<T>;
    nextSibling?: Node<T>;
};

export function makeNode<T>(base?: Node<T>): Node<T> {
    return {
        ...base,
    };
}

export function appendChild<T>(node: Node<T>, child: Node<T>) {
    child.parent = node;

    if (node.lastChild) {
        node.lastChild.nextSibling = child;

        child.prevSibling = node.lastChild;
        child.nextSibling = undefined;

        node.lastChild = child;
    } else {
        child.prevSibling = undefined;
        child.nextSibling = undefined;

        node.firstChild = child;
        node.lastChild = child;
    }
}

export function insertSiblingAfter<T>(node: Node<T>, sibling: Node<T>) {
    if (!node.parent) {
        throw new Error('Cannot add siblings to a node without a parent');
    }

    sibling.parent = node.parent;

    if (node.nextSibling) {
        const currentSibling = node.nextSibling;

        node.nextSibling = sibling;
        sibling.prevSibling = node;

        currentSibling.prevSibling = sibling;
        sibling.nextSibling = currentSibling;
    } else {
        node.nextSibling = sibling;
        sibling.prevSibling = node;

        node.parent.lastChild = sibling;
    }
}

export function isValidAST<T>(root: Node<T>): boolean {
    if (root.parent) {
        return false;
    }

    const walker = walkAST(root);

    while (walker.hasNext()) {
        const {node, entering} = walker.next();
        if (!entering) {
            continue;
        }

        if (!isNodeValid(node)) {
            return false;
        }
    }

    return true;
}

function isNodeValid<T>(node: Node<T>, reasonCallback?: (reason: string) => void): boolean {
    // This is intended to be used as part of isValidAST, so it only checks "forward" in the tree

    if (node.nextSibling) {
        if (!node.parent) {
            // A node must have a parent to have siblings
            reasonCallback?.('A node must have a parent to have siblings');
            return false;
        }

        if (node.nextSibling.prevSibling !== node) {
            // Siblings must refer to each other properly
            reasonCallback?.('Siblings must refer to each other properly');
            return false;
        }

        if (node.nextSibling.parent !== node.parent) {
            // All direct siblings must have the same parent
            reasonCallback?.('All direct siblings must have the same parent');
            return false;
        }
    } else {
        if (node.parent && node.parent.lastChild !== node) {
            // If a node has no next sibling, it must be the last child
            reasonCallback?.('If a node has no next sibling, it must be the last child');
            return false;
        }
    }

    if (node.firstChild) {
        if (node.firstChild.parent !== node) {
            // Parent/siblings must refer to each other properly
            reasonCallback?.('Parent/siblings must refer to each other properly');
            return false;
        }

        if (node.firstChild.prevSibling) {
            // The first child cannot have previous siblings
            reasonCallback?.('The first child cannot have previous siblings');
            return false;
        }
    }

    if ((node.firstChild && !node.lastChild) || (!node.firstChild && node.lastChild)) {
        // Having a first child means you have to have a last child and vice versa
        reasonCallback?.('Having a first child means you have to have a last child and vice versa');
        return false;
    }

    return true;
}

export interface Walker<T = never> {
    hasNext(): boolean;
    next(): {node: Node<T>; entering: boolean} | undefined;
    resumeAt(node: Node<T>, entering: boolean);
}
export interface WalkerEvent<T = never> {
    node: Node<T>;
    entering: boolean;
}

export class Walker<T = never> {
    private current: Node<T>;
    private isEntering = true;

    constructor(root: Node<T>) {
        this.current = root;
    }

    hasNext() {
        return Boolean(this.current);
    }

    next(): WalkerEvent<T> {
        if (!this.current) {
            return undefined;
        }

        const node = this.current;
        const wasEntering = this.isEntering;

        if (this.isEntering) {
            if (node.firstChild) {
                this.current = node.firstChild;
                this.isEntering = true;
            } else {
                this.isEntering = false;
            }
        } else {
            if (node.nextSibling) {
                this.current = node.nextSibling;
                this.isEntering = true;
            } else {
                this.current = node.parent;
                this.isEntering = false;
            }
        }

        return {
            node,
            entering: wasEntering,
        };
    }

    resumeAt(node: Node<T>, entering: boolean) {
        this.current = node;
        this.isEntering = entering;
    }

    [Symbol.iterator](): Iterator<WalkerEvent<T>> {
        return {
            next: () => {
                const value = this.next();
                return {
                    done: !value,
                    value: value,
                };
            },
        };
    }
}

export function walkAST<T>(root: Node<T>): Walker<T> {
    return new Walker(root);
}
