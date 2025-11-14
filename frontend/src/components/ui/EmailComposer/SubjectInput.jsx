import React from 'react';
import HoverField from './HoverField';

const SubjectInput = ({ value = '', onChange }) => {
  return (
    <HoverField
      label="Assunto"
      inputProps={{ placeholder: 'Assunto do e-mail', value, onChange: (e) => onChange && onChange(e.target.value) }}
    />
  );
};

export default SubjectInput;
