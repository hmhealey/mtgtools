## June 18, 2023

-   `react-scripts` doesn't support TypeScript 5 (https://github.com/facebook/create-react-app/issues/13080). It seems to work fine, but it causes a peer dependency warning and some seemingly-harmless errors logged when first running `yarn start`. I added to the `logFilters` in `.yarnrc.yml` to hide the peer dependency warning because I wasn't able to fix it with `packageExtensions`, but I wasn't able to hide the `yarn start` errors.
-   I want to figure out why VS Code complains about the extensions `react-testing-library` makes to `expect` since that's what I was last fighting with. The tests work fine with `@jest/global` and the app builds, but VS Code's TypeScript complains about typing.

## July 2, 2023

-   I've spent a bunch more time yesterday and today fighting with Jest, VS Code, and TypeScript. I found out that:
    -   Yarn actually patches packages like TS to have them work with its PNP package resolution.
    -   I need to pass `--runInBand` to Jest for some reason to have it actually run instead of hanging. I don't understand why, but I think we have that set in MM as well.
    -   `react-scripts` isn't using my standalone `jest.config.js`. The only way to change those options is using some of Jest's CLI options or by specifying the Jest config in the `package.json`. Both of those cases limit the number of options I have access to.
    -   I was unable to move `setupTests.ts` because that's hardcoded with `react-scripts`, and it won't let me modify `setupFilesAfterEnv`.
-   To get around those, I tried to run Jest directly from the `test` script, but that didn't work because I didn't explicitly depend on it or some related dependencies (`ts-jest` and `jest-environment-jsdom`) in the package.json. I added those and as explicit dependencies, but when I next ran Jest, it was unable to find dependencies or type definitions for those dependencies.
    -   It seems like this might be because either Jest isn't using the version of TS that Yarn has patched or because something with workspaces.
-   I think I need to give up on some combination of Yarn, PNP, and `react-scripts`.

## July 17, 2023

-   `create-react-app` has been deprecated...