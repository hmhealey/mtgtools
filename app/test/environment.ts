import JSDOMEnvironment from 'jest-environment-jsdom';

export default class Environment extends JSDOMEnvironment {
    constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
        super(...args);

        // Inject Node's fetch into the JSDOM environment
        this.global.fetch = fetch;
        this.global.Headers = Headers;
        this.global.Request = Request;
        this.global.Response = Response;
    }
}
