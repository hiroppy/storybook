import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';

import Rules from './Rules';

const Item = styled.li({
  fontWeight: 600,
});
const ItemTitle = styled.span({
  borderBottom: '1px solid rgb(130, 130, 130)',
  width: '100%',
  display: 'inline-block',
  paddingBottom: '4px',
  marginBottom: '4px',
});

interface ElementProps {
  element: {
    any: Array<any>;
    all: Array<any>;
    none: Array<any>;
  };
  passes: boolean;
}

function Element({ element, passes }: ElementProps) {
  const { any, all, none } = element;

  const rules = [...any, ...all, ...none];

  return (
    <Item>
      <ItemTitle>{(element as any).target[0]}</ItemTitle>
      <Rules rules={rules} passes={passes} />
    </Item>
  );
}
Element.propTypes = {
  element: PropTypes.shape({
    any: PropTypes.array.isRequired,
    all: PropTypes.array.isRequired,
    none: PropTypes.array.isRequired,
  }).isRequired,
  passes: PropTypes.bool.isRequired,
};

interface ElementsProps {
  elements: Array<{
    any: Array<any>;
    all: Array<any>;
    none: Array<any>;
  }>;
  passes: boolean;
}

/* eslint-disable react/no-array-index-key */
const Elements = ({ elements, passes }: ElementsProps) => (
  <ol>
    {elements.map((element, index) => (
      <Element passes={passes} element={element} key={index} />
    ))}
  </ol>
);

Elements.propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      any: PropTypes.array.isRequired,
      all: PropTypes.array.isRequired,
      none: PropTypes.array.isRequired,
    })
  ).isRequired,
  passes: PropTypes.bool.isRequired,
};

export default Elements;
