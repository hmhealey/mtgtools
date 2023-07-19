import {MatcherFunction} from 'expect';
import {Walker, appendChild, insertSiblingAfter, isValidAST, makeNode, walkAST} from './ast';

describe('appendChild', () => {
    test('should be able to append a child to a single node with no children', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});

        appendChild(root, a);

        expect(isValidAST(root)).toBe(true);

        expect(root.firstChild).toBe(a);
        expect(root.lastChild).toBe(a);

        expect(a.parent).toBe(root);
    });

    test('should be able to append multiple children to a single node', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});
        const b = makeNode({name: 'b'});
        const c = makeNode({name: 'c'});

        appendChild(root, a);
        appendChild(root, b);
        appendChild(root, c);

        /*
        - root
            - a
                - b
                    - c
        */

        expect(isValidAST(root)).toBe(true);

        expect(root.firstChild).toBe(a);
        expect(root.lastChild).toBe(c);

        expect(a.parent).toBe(root);
        expect(b.parent).toBe(root);
        expect(c.parent).toBe(root);

        expect(a.prevSibling).toBe(undefined);
        expect(a.nextSibling).toBe(b);
        expect(b.prevSibling).toBe(a);
        expect(b.nextSibling).toBe(c);
        expect(c.prevSibling).toBe(b);
        expect(c.nextSibling).toBe(undefined);
    });

    test('should be able to append a child to a root which already has nested levels of children', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});
        const b = makeNode({name: 'b'});
        const c = makeNode({name: 'c'});

        appendChild(root, a);
        appendChild(a, b);
        appendChild(root, c);

        /*
        - root
            - a
                - b
            - c
        */

        expect(isValidAST(root)).toBe(true);

        expect(root.firstChild).toBe(a);
        expect(root.lastChild).toBe(c);

        expect(a.parent).toBe(root);
        expect(b.parent).toBe(a);
        expect(c.parent).toBe(root);

        expect(a.prevSibling).toBe(undefined);
        expect(a.nextSibling).toBe(c);
        expect(b.prevSibling).toBe(undefined);
        expect(b.nextSibling).toBe(undefined);
        expect(c.prevSibling).toBe(a);
        expect(c.nextSibling).toBe(undefined);
    });
});

describe('insertSiblingAfter', () => {
    test('should be able to insert a sibling after a single child', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});

        appendChild(root, a);

        /*
        - root
            - a
        */

        const b = makeNode({name: 'b'});

        insertSiblingAfter(a, b);

        /*
        - root
            - a
            - b
        */

        expect(isValidAST(root)).toBe(true);

        expect(root.firstChild).toBe(a);
        expect(root.lastChild).toBe(b);

        expect(a.parent).toBe(root);
        expect(b.parent).toBe(root);

        expect(a.prevSibling).toBe(undefined);
        expect(a.nextSibling).toBe(b);
        expect(b.prevSibling).toBe(a);
        expect(b.nextSibling).toBe(undefined);
    });

    test('should be able to insert a sibling after multiple children', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});
        const b = makeNode({name: 'b'});

        appendChild(root, a);
        appendChild(root, b);

        /*
        - root
            - a
            - b
        */

        const c = makeNode({name: 'c'});

        insertSiblingAfter(b, c);

        /*
        - root
            - a
            - b
            - c
        */

        expect(isValidAST(root)).toBe(true);

        expect(root.firstChild).toBe(a);
        expect(root.lastChild).toBe(c);

        expect(a.parent).toBe(root);
        expect(b.parent).toBe(root);
        expect(c.parent).toBe(root);

        expect(a.prevSibling).toBe(undefined);
        expect(a.nextSibling).toBe(b);
        expect(b.prevSibling).toBe(a);
        expect(b.nextSibling).toBe(c);
        expect(c.prevSibling).toBe(b);
        expect(c.nextSibling).toBe(undefined);
    });

    test('should be able to insert a sibling between multiple children', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});
        const b = makeNode({name: 'b'});

        appendChild(root, a);
        appendChild(root, b);

        /*
        - root
            - a
            - b
        */

        const c = makeNode({name: 'c'});

        insertSiblingAfter(a, c);

        /*
        - root
            - a
            - c
            - b
        */

        expect(isValidAST(root)).toBe(true);

        expect(root.firstChild).toBe(a);
        expect(root.lastChild).toBe(b);

        expect(a.parent).toBe(root);
        expect(b.parent).toBe(root);
        expect(c.parent).toBe(root);

        expect(a.prevSibling).toBe(undefined);
        expect(a.nextSibling).toBe(c);
        expect(b.prevSibling).toBe(c);
        expect(b.nextSibling).toBe(undefined);
        expect(c.prevSibling).toBe(a);
        expect(c.nextSibling).toBe(b);
    });

    test('should not be able to add siblings to the root node', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});

        expect(() => insertSiblingAfter(root, a)).toThrowError();
    });
});

describe('isValidAST', () => {
    test('a single node should be valid', () => {
        /*
        - a
        */
        const root = makeNode({name: 'root'});

        expect(isValidAST(root)).toBe(true);
    });

    test('a node with one child should be valid', () => {
        /*
        - root
            - a
        */
        const root = makeNode({name: 'root'});

        const a = makeNode({name: 'a', parent: root});
        root.firstChild = a;
        root.lastChild = a;

        expect(isValidAST(root)).toBe(true);
    });

    test('a node with multiple children should be valid', () => {
        /*
        - root
            - a
            - b
            - c
        */
        const root = makeNode({name: 'root'});

        const a = makeNode({name: 'a', parent: root});
        root.firstChild = a;
        const b = makeNode({name: 'b', parent: root, prevSibling: a});
        a.nextSibling = b;
        const c = makeNode({name: 'c', parent: root, prevSibling: b});
        b.nextSibling = c;
        root.lastChild = c;

        expect(isValidAST(root)).toBe(true);
    });

    test('a tree with arbitrarily nested children should be valid', () => {
        /*
        - root
            - a
                - d
                    - e
                    - f
                - g
                    - h
                        - i
                - j
            - b
            - c
                - k
                    - l
        */
        const root = makeNode({name: 'root'});

        const a = makeNode({name: 'a', parent: root});
        root.firstChild = a;
        const b = makeNode({name: 'b', parent: root, prevSibling: a});
        a.nextSibling = b;
        const c = makeNode({name: 'c', parent: root, prevSibling: b});
        b.nextSibling = c;
        root.lastChild = c;

        const d = makeNode({name: 'd', parent: a});
        a.firstChild = d;

        const e = makeNode({name: 'e', parent: d});
        d.firstChild = e;
        const f = makeNode({name: 'f', parent: d, prevSibling: e});
        e.nextSibling = f;
        d.lastChild = f;

        const g = makeNode({name: 'g', parent: a, prevSibling: d});
        d.nextSibling = g;

        const h = makeNode({name: 'h', parent: g});
        g.firstChild = h;
        g.lastChild = h;

        const i = makeNode({name: 'i', parent: h});
        h.firstChild = i;
        h.lastChild = i;

        const j = makeNode({name: 'j', parent: a, prevSibling: g});
        g.nextSibling = j;
        a.lastChild = j;

        const k = makeNode({name: 'k', parent: c});
        c.firstChild = k;
        c.lastChild = k;

        const l = makeNode({name: 'l', parent: k});
        k.firstChild = l;
        k.lastChild = l;

        expect(isValidAST(root)).toBe(true);
    });

    test('a non-root tree should not be valid', () => {
        /*
        - root
            - a
        */
        const root = makeNode({name: 'root'});

        const a = makeNode({name: 'a', parent: root});

        root.firstChild = a;
        root.lastChild = a;

        expect(isValidAST(a)).toBe(false);
    });

    test('a node containing itself should not be valid', () => {
        /*
        - root
            - root
        */
        const root = makeNode({name: 'root'});

        root.firstChild = root;
        root.lastChild = root;

        expect(isValidAST(root)).toBe(false);
    });

    test('a node containing a child containing itself should not be valid', () => {
        /*
        - root
            - a
                - b
                    - a
        */
        const root = makeNode({name: 'root'});

        const a = makeNode({name: 'a', parent: root});
        root.firstChild = a;
        root.lastChild = a;

        const b = makeNode({name: 'b', parent: a, firstChild: a, lastChild: a});
        a.firstChild = b;
        a.lastChild = b;

        expect(isValidAST(root)).toBe(false);
    });

    test('a node containing an infinite list of children should not be valid', () => {
        /*
        - root
            - a
            - b
            - a
            - b
            ...
        */
        const root = makeNode({name: 'root'});

        const a = makeNode({name: 'a', parent: root});
        root.firstChild = a;

        const b = makeNode({name: 'b', parent: root, nextSibling: a});
        a.nextSibling = b;
        root.lastChild = b;

        expect(isValidAST(root)).toBe(false);

        // Even if we have proper sibling linkage
        a.prevSibling = b;
        b.prevSibling = a;

        expect(isValidAST(root)).toBe(false);
    });

    test('a tree containing the same node twice should not be valid', () => {
        /*
        - root
            - a
            - b
            - c
                - d
                - a
                - e
        */
        const root = makeNode({name: 'root'});

        const a = makeNode({name: 'a', parent: root});
        const b = makeNode({name: 'b', parent: root, prevSibling: a});
        a.nextSibling = b;
        const c = makeNode({name: 'c', parent: root, prevSibling: b});
        b.nextSibling = c;

        root.firstChild = a;
        root.lastChild = c;

        const d = makeNode({name: 'd', parent: c, nextSibling: a});
        c.firstChild = d;
        const e = makeNode({name: 'e', parent: c, prevSibling: a});
        c.lastChild = e;

        expect(isValidAST(root)).toBe(false);
    });
});

describe('walkAST', () => {
    test('should walk through a single node', () => {
        const root = makeNode({name: 'root'});

        /*
        - root
        */

        const walker = walkAST(root);

        expect(walker).toWalkTo('root', true);
        expect(walker).toWalkTo('root', false);
        expect(walker.hasNext()).toBe(false);
        expect(walker.next()).toEqual(undefined);
    });

    test('should walk through multiple children in order', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});
        const b = makeNode({name: 'b'});
        const c = makeNode({name: 'c'});

        appendChild(root, a);
        appendChild(root, b);
        appendChild(root, c);

        /*
        - root
            - a
            - b
            - c
        */

        const walker = walkAST(root);

        expect(walker).toWalkTo('root', true);
        expect(walker).toWalkTo('a', true);
        expect(walker).toWalkTo('a', false);
        expect(walker).toWalkTo('b', true);
        expect(walker).toWalkTo('b', false);
        expect(walker).toWalkTo('c', true);
        expect(walker).toWalkTo('c', false);
        expect(walker).toWalkTo('root', false);
        expect(walker.hasNext()).toBe(false);
        expect(walker.next()).toEqual(undefined);
    });

    test('should walk through nested children in order', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});
        const b = makeNode({name: 'b'});
        const c = makeNode({name: 'c'});

        appendChild(root, a);
        appendChild(a, b);
        appendChild(b, c);

        /*
        - root
            - a
                - b
                    - c
        */

        const walker = walkAST(root);

        expect(walker).toWalkTo('root', true);
        expect(walker).toWalkTo('a', true);
        expect(walker).toWalkTo('b', true);
        expect(walker).toWalkTo('c', true);
        expect(walker).toWalkTo('c', false);
        expect(walker).toWalkTo('b', false);
        expect(walker).toWalkTo('a', false);
        expect(walker).toWalkTo('root', false);
        expect(walker.hasNext()).toBe(false);
        expect(walker.next()).toEqual(undefined);
    });

    test('should walk through multiple nested children in order', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});
        const b = makeNode({name: 'b'});
        const c = makeNode({name: 'c'});
        const d = makeNode({name: 'd'});
        const e = makeNode({name: 'e'});
        const f = makeNode({name: 'f'});

        appendChild(root, a);
        appendChild(a, b);
        appendChild(root, c);
        appendChild(c, d);
        appendChild(root, e);
        appendChild(e, f);

        /*
        - root
            - a
                - b
            - c
                - d
            - e
                - f
        */

        const walker = walkAST(root);

        expect(walker).toWalkTo('root', true);
        expect(walker).toWalkTo('a', true);
        expect(walker).toWalkTo('b', true);
        expect(walker).toWalkTo('b', false);
        expect(walker).toWalkTo('a', false);
        expect(walker).toWalkTo('c', true);
        expect(walker).toWalkTo('d', true);
        expect(walker).toWalkTo('d', false);
        expect(walker).toWalkTo('c', false);
        expect(walker).toWalkTo('e', true);
        expect(walker).toWalkTo('f', true);
        expect(walker).toWalkTo('f', false);
        expect(walker).toWalkTo('e', false);
        expect(walker).toWalkTo('root', false);
        expect(walker.hasNext()).toBe(false);
        expect(walker.next()).toEqual(undefined);
    });

    test('should walk through spiky nested children in order', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});
        const b = makeNode({name: 'b'});
        const c = makeNode({name: 'c'});
        const d = makeNode({name: 'd'});
        const e = makeNode({name: 'e'});

        appendChild(root, a);
        appendChild(a, b);
        appendChild(root, c);
        appendChild(root, d);
        appendChild(d, e);

        /*
        - root
            - a
                - b
            - c
            - d
                - e
        */

        const walker = walkAST(root);

        expect(walker).toWalkTo('root', true);
        expect(walker).toWalkTo('a', true);
        expect(walker).toWalkTo('b', true);
        expect(walker).toWalkTo('b', false);
        expect(walker).toWalkTo('a', false);
        expect(walker).toWalkTo('c', true);
        expect(walker).toWalkTo('c', false);
        expect(walker).toWalkTo('d', true);
        expect(walker).toWalkTo('e', true);
        expect(walker).toWalkTo('e', false);
        expect(walker).toWalkTo('d', false);
        expect(walker).toWalkTo('root', false);
        expect(walker.hasNext()).toBe(false);
        expect(walker.next()).toEqual(undefined);
    });

    test('a tree with arbitrarily nested children should be valid', () => {
        const root = makeNode({name: 'root'});
        const a = makeNode({name: 'a'});
        const b = makeNode({name: 'b'});
        const c = makeNode({name: 'c'});
        const d = makeNode({name: 'd'});
        const e = makeNode({name: 'e'});
        const f = makeNode({name: 'f'});
        const g = makeNode({name: 'g'});
        const h = makeNode({name: 'h'});
        const i = makeNode({name: 'i'});
        const j = makeNode({name: 'j'});
        const k = makeNode({name: 'k'});
        const l = makeNode({name: 'l'});

        appendChild(root, a);
        appendChild(root, b);
        appendChild(root, c);
        appendChild(a, d);
        appendChild(d, e);
        appendChild(d, f);
        appendChild(a, g);
        appendChild(g, h);
        appendChild(h, i);
        appendChild(a, j);
        appendChild(c, k);
        appendChild(k, l);

        /*
        - root
            - a
                - d
                    - e
                    - f
                - g
                    - h
                        - i
                - j
            - b
            - c
                - k
                    - l
        */

        const walker = walkAST(root);

        expect(walker).toWalkTo('root', true);
        expect(walker).toWalkTo('a', true);
        expect(walker).toWalkTo('d', true);
        expect(walker).toWalkTo('e', true);
        expect(walker).toWalkTo('e', false);
        expect(walker).toWalkTo('f', true);
        expect(walker).toWalkTo('f', false);
        expect(walker).toWalkTo('d', false);
        expect(walker).toWalkTo('g', true);
        expect(walker).toWalkTo('h', true);
        expect(walker).toWalkTo('i', true);
        expect(walker).toWalkTo('i', false);
        expect(walker).toWalkTo('h', false);
        expect(walker).toWalkTo('g', false);
        expect(walker).toWalkTo('j', true);
        expect(walker).toWalkTo('j', false);
        expect(walker).toWalkTo('a', false);
        expect(walker).toWalkTo('b', true);
        expect(walker).toWalkTo('b', false);
        expect(walker).toWalkTo('c', true);
        expect(walker).toWalkTo('k', true);
        expect(walker).toWalkTo('l', true);
        expect(walker).toWalkTo('l', false);
        expect(walker).toWalkTo('k', false);
        expect(walker).toWalkTo('c', false);
        expect(walker).toWalkTo('root', false);
        expect(walker.hasNext()).toBe(false);
        expect(walker.next()).toEqual(undefined);
    });
});

const toWalkTo: MatcherFunction<[string, boolean]> = function (actual: any, name: string, entering: boolean) {
    if (
        !(
            typeof actual.hasNext === 'function' &&
            typeof actual.next === 'function' &&
            typeof actual.resumeAt === 'function'
        )
    ) {
        return {
            message: () =>
                'expected object to be a walker, but received an object with the keys ' + Object.keys(actual),
            pass: false,
        };
    }

    const walker = actual as Walker<{name: string}>;

    if (!walker.hasNext()) {
        return {
            message: () => 'expected walker to still have more',
            pass: false,
        };
    }

    const event = walker.next();

    if (event.node.name !== name) {
        return {
            message: () =>
                'expected walker event to be a node named ' + name + ', but received a node named ' + event.node.name,
            pass: false,
        };
    }

    if (event.entering !== entering) {
        return {
            message: () =>
                'expected walker event to have entering=' + entering + ', but received entering=' + event.entering,
            pass: false,
        };
    }

    return {
        message: () => '',
        pass: true,
    };
};

expect.extend({
    toWalkTo,
});

interface CustomMatchers<R = unknown> {
    toWalkTo(name: string, entering: boolean): R;
}

declare global {
    namespace jest {
        interface Expect extends CustomMatchers {}
        interface Matchers<R> extends CustomMatchers<R> {}
        interface InverseAsymmetricMatchers extends CustomMatchers {}
    }
}
