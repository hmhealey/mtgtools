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

## July 19, 2023

-   I ended up writing a parser for oracle text as sent from Scryfall.
    -   I started with just a parser similar to how Marked worked last I looked, but I split out a tokenizer to make it hopefully easier to add handling for things like symbols inside of reminder text.
    -   I also tried to do some more complicated parsing of things like bulleted lists to hopefully make it output some more semantic HTML than Scryfall uses for things like lists. As a potential future improvement, identification of things like keywords to display tooltips or creature types to show search links.
    -   Tokens currently have a start and end index, but I'm not convinced I'll need that. I've left it in for now, but it doesn't make it to the AST at the moment, so it won't be much use there.
-   Ability and flavor words were a bit of a pain to recognize so that they could be italicized, but I'm pretty happy with the solution.
    -   Scryfall has an API that gives us a list of ability words, but that isn't available for the flavor words that WotC started adding recently for sets like AFR and 40K.
    -   I settled on treating all text from the start of a line until an em dash surrounded on both sides by spaces as an ability/flavor word. I was worried that this would incorrectly match abilities with non-mana costs (like the Flashback on Deep Analysis), but those em dashes have no whitespace around them. The only case I've found where this doesn't work are for a handful of cards that write anchor words in this way (like the Sieges from FRF), but there are few enough that I don't think it matters.
    -   The card text on Gatherer shows `<i></i>` tags around both ability and flavor words, but I wasn't able to find a way to get this in Scryfall results.
-   Overall, I'm happy with this code since it seems to handle most cases, but there's some cases that aren't supported such as:
    -   As above, anchor words in the Sieges from FRF are incorrectly identified as ability/flavor words.
    -   The ability word in Treasure Chest's first die roll result isn't identified as an ability word because it comes after a die roll. This seems to be the only card that does this, so I'm not bothering fixing that now.
    -   Loyalty icons in card text aren't recognized as symbols, but I'm not going to bother changing that since Scryfall doesn't have images for loyalty icons for me to use.
    -   I could add support for card types like Planeswalkers and Sagas if I want the app to understand the cards better.
    -   I could also make the parser able to identify patterns like die roll cards and prototype cards, but those aren't super common.

## July 31, 2023

-   The App package tests have been broken since I added `ScryfallWrapper` last time because using `fetch` in Jest is hard. Using the default `node` test environment uses Node.js's implementation, but that isn't provided in the `jsdom` environment. A big part of the reason for that is that Node's implementation isn't spec-compliant, but none of the other polyfills or implementations are either, so I may as well use the Node one. I copied [these instructions](https://github.com/jsdom/jsdom/issues/1724#issuecomment-1446858041) on how to add the Node one to the test environment.
    -   I saw an older post that said Nock was unable to mock Node's implementation of `fetch`, so if I end up adding that, I'll likely need to switch to `node-fetch` or something similar for testing.
    -   Links:
        -   https://blog.logrocket.com/fetch-api-node-js/
        -   https://github.com/jsdom/jsdom/issues/1724
-   Related to the above, I may need to consider adding a mock of some sort for the tests since any component tests involving `ScryfallWrapper` hit the Scryfall API right now.
