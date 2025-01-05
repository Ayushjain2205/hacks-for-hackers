import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CustomCodeEditorProps {
  value: string;
  language: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

const CustomCodeEditor: React.FC<CustomCodeEditorProps> = ({
  value,
  language,
  placeholder,
  onChange,
}) => {
  return (
    <div className="relative rounded-md overflow-hidden">
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          borderRadius: "0.375rem",
          backgroundColor: "#f8f9fa",
        }}
      >
        {(value || placeholder || "").toString()}
      </SyntaxHighlighter>
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-gray-900 resize-none p-4 focus:outline-none"
        spellCheck="false"
      />
    </div>
  );
};

export default CustomCodeEditor;
