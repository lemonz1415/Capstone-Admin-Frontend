import { Editor } from "@tinymce/tinymce-react";

type TinyMCEEditorProps = {
  value: string;
  onChange: (content: string) => void;
};

const TinyMCEEditor = ({ value, onChange }: TinyMCEEditorProps) => {
  const plugins = [
    "advlist",
    "autolink",
    "link",
    "image",
    "lists",
    "charmap",
    "preview",
    "anchor",
    "pagebreak",
    "searchreplace",
    "wordcount",
    "visualblocks",
    "visualchars",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "emoticons",
    "help",
  ];

  const toolbar =
    "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | preview | forecolor backcolor";

  return (
    <Editor
      apiKey="bvmx4aekn3lls7wdu7yrk91irijmtfvnv4et1z8p44mer6q4"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 300,
        menubar: false,
        plugins: plugins,
        toolbar: toolbar,
      }}
    />
  );
};

export default TinyMCEEditor;
