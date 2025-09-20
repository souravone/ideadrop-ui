type TextareaBoxProps = {
  htmlFor: string;
  label?: string;
  type?: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
};

function TextareaBox({
  htmlFor,
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 6,
}: TextareaBoxProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-gray-700 font-medium mb-1">
        {label}
      </label>
      <textarea
        id={htmlFor}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
}

export default TextareaBox;
