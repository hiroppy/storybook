import { document } from 'global';
import axe from 'axe-core';
import deprecate from 'util-deprecate';
import { stripIndents } from 'common-tags';

import addons, { makeDecorator } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import EVENTS, { PARAM_KEY } from './constants';

const channel = addons.getChannel();
let progress = Promise.resolve();
let options;

const getElement = () => {
  const storyRoot = document.getElementById('story-root');

  if (storyRoot) {
    return storyRoot.children;
  }
  return document.getElementById('root');
};

const report = input => {
  channel.emit(EVENTS.RESULT, input);
};

const run = o => {
  progress = progress.then(() => {
    axe.reset();
    if (o) {
      axe.configure(o);
    }
    return axe.run(getElement()).then(report);
  });
};

export const withA11Y = makeDecorator({
  name: 'withA11Y',
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: false,
  allowDeprecatedUsage: false,

  wrapper: (getStory, context, opt) => {
    options = opt.parameters || opt.options;

    return getStory(context);
  },
});

channel.on(STORY_RENDERED, () => run(options));
channel.on(EVENTS.REQUEST, () => run(options));

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

// TODO: REMOVE at v6.0.0
export const checkA11y = deprecate((...args) => withA11Y(...args), 'checkA11y has been replaced with withA11Y');

// TODO: REMOVE at v6.0.0
export const configureA11y = deprecate(
  config => {
    options = config;
  },
  stripIndents`
    configureA11y is deprecated, please configure addon-a11y using the addParameter api:
    
    addParameters({
      a11y: {
        // ... axe options
        element: '#root', // optional selector which element to inspect
      },
    });
  `
);
