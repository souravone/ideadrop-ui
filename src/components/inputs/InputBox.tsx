type InputBoxProps = {
  htmlFor: string;
  label?: string;
  type?: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
};

function InputBox({
  htmlFor,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}: InputBoxProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-gray-700 font-medium mb-1">
        {label}
      </label>
      <input
        type={type}
        id={htmlFor}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
}

export default InputBox;
