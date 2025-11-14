import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Field, Label, ButtonSecondary, Dropzone, DropHeader, AttachList } from './EmailComposer.styles';
import HoverField from './HoverField';
import AttachmentItem from './AttachmentItem';

const AttachmentDropzone = ({ attachments = [], onAdd = () => {}, onRemove = () => {} }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (onAdd) onAdd(acceptedFiles);
  }, [onAdd]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Field>
      <Label>Anexos</Label>
      <HoverField label="Anexos">
        <Dropzone {...getRootProps()}>
          <input {...getInputProps()} />
          <DropHeader>
            <div>{isDragActive ? 'Solte os arquivos aqui...' : 'Arraste e solte arquivos aqui ou clique para selecionar'}</div>
            <ButtonSecondary type="button">Selecionar</ButtonSecondary>
          </DropHeader>
          <AttachList>
            {attachments.length === 0 ? (
              <small>Nenhum arquivo anexado</small>
            ) : (
              attachments.map((f, idx) => (
                <AttachmentItem key={f.name + idx} file={f} onRemove={() => onRemove(idx)} />
              ))
            )}
          </AttachList>
        </Dropzone>
      </HoverField>
    </Field>
  );
};

export default AttachmentDropzone;
