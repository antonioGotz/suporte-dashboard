import React from 'react';
import { Field, Label, HoverControl, Input } from './EmailComposer.styles';

// Reusable field wrapper: label + hoverable control area.
// Props:
// - label: string (label text)
// - children: if provided, rendered inside HoverControl; otherwise renders a styled Input
// - inputProps: props passed to Input when children not provided
const HoverField = ({ label, children = null, inputProps = {} }) => {
  return (
    <Field>
      {label ? <Label>{label}</Label> : null}
      <HoverControl>
        {children ? children : <Input {...inputProps} />}
      </HoverControl>
    </Field>
  );
};

export default HoverField;
