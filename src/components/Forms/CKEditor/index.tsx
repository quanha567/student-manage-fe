import { Controller, useFormContext } from 'react-hook-form';
import ReactQuill from 'react-quill';

interface FormCKEditorProps {
  name: string;
  id?: string;
}

const FormCKEditor = (props: FormCKEditorProps) => {
  const { control } = useFormContext();

  const { name, id } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ReactQuill
          {...field}
          id={id}
          className="ql-editor-custom"
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image', 'video'],
              ['clean'],
            ],
          }}
          {...props}
        />
      )}
    />
  );
};

export default FormCKEditor;
