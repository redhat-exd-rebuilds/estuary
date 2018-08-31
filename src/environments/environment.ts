// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build -c production` then `environment.prod.ts` will be used instead.
// The list of which configuration maps to which file can be found in `angular.json`.

export const environment = {
  production: false,
  api: 'http://127.0.0.1:5000/api/v1/',
  enableAuth: false,
  oidcIssuer: null,
  oidcClientId: null
};
