Package.describe({
  name: 'fongandrew:collection2-common',
  summary: 'Some simple reusable schema definitions for aldeed:collection2',
  version: '0.2.0',
  git: 'https://github.com/fongandrew/meteor-collection2-common.git'
});

Package.onUse(function(api) {
  'use strict';

  api.versionsFrom('1.0');
  api.use('aldeed:collection2@2.2.0');
  api.imply('aldeed:collection2');
  api.use('random');
  api.use('underscore');
  api.addFiles('collection2_common.js');
  api.export(['CommonFields'], ['client', 'server']);
});

Package.onTest(function(api) {
  'use strict';

  api.use('tinytest');
  api.use('fongandrew:collection2-common');
  api.addFiles('collection2_common_tests.js');
});
