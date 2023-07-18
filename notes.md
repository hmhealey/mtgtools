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
    -   They're now recommending the equivalent scripts for Next.js or Remix since raw React is so limited on its own.
    -   I got rid of it in favour of doing things manually. Now that I've done this a few times, it was easy enough to pare it down to Webpack, `style-loader`/`css-loader` for CSS, `html-webpack-plugin` for HTML, TS/`ts-loader` for compiling TS, and Jest/`ts-jest`/`jest-environment-jsdom` for Testing. This all seems to work now.
-   Currently, I'm just using TS Project References for organizing building the different packages. `ts-loader` seems to support this automatically once I worked out some issues caused by me being on WSL 1. If that doesn't work, `Wireit` seems like a good solution for sorting out that dependency graph.
-   I played around with trying to use `React.Suspense` for handling showing loading indicators while fetching data, but it's not recommended for data loading use yet. There's some discussion around using it for that (see `useSWR`), but it doesn't use it yet.

## July 18, 2023

-   I spent a bunch of time trying to get auto imports working right in VS Code. Currently, importing from the Scryfall package tends to import from `@hmhealey/scryfall/src/...` instead of `@hmhealey/scryfall/...`.
    -   This is because of a behaviour with project references where VS Code looks at the source code instead of the compiled files in case the project isn't built yet. Unfortunately, that seems to affect both the Intellisense (bad) and Go To Definition (good). The tooltip when hovering over the import path in the editor also includes the `src` directory.
    -   If I disable this with `compilerOptions.disableSourceOfProjectReferenceRedirect` in `app/tsconfig.json`, it fixes the auto imports, but it means that Go To Definition sends you to the `.d.ts` file instead of the source file.
    -   A few other things I tried are:
        -   Some values of the `include` option in `app/tsconfig.json` also seems to sometimes behave as if `disableSourceOfProjectReferenceRedirect` was enabled, but it's likely I wasn't using that setting correctly. I decided to not have it in `app/tsconfig.json`, but I added it to the Scryfall package one.
        -   Turning on `strict` in the Scryfall package seemed to work, but it didn't end up working reliably. There were also some cases where it completely disappeared from Intellisense, but maybe I was just confusing VS Code at that point. I left it on for the time being even if it did require some fighting with type checking `client.test.ts`.
        -   I also tried fighting with the Import Module Specifier setting in VS Code since that came up in various StackOverflow and GitHub Issues posts, but it didn't seem to have any effect on this. It seems like a lot of those posts are having the opposite problem where import paths include the `dist` directory instead of the `src` one which I'm seeing.
