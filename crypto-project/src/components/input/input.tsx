import './input.scss';

type InputProps = {
    type: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder?: string,
    step?: string,
    data? : string
}
export const Input = ({type, value, placeholder = 'input', step = 'any', data, onChange}: InputProps) => {
    return (
      <input
        autoFocus
        type={type}
        step={step}
        placeholder={placeholder}
        className="input"
        value={value}
        onChange={onChange}
        data-cy={data}
      />
    );
}