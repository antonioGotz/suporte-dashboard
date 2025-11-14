import React from 'react';
import { AttachItemRow, AttachName, ButtonGhost } from './EmailComposer.styles';

const AttachmentItem = ({ file, onRemove }) => {
  if (!file) return null;
  return (
    <AttachItemRow>
      <AttachName title={file.name}>{file.name}</AttachName>
      <ButtonGhost type="button" onClick={() => onRemove && onRemove(file)}>Remover</ButtonGhost>
    </AttachItemRow>
  );
};

export default AttachmentItem;
