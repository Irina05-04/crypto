import './input.scss';

type InputProps = {
    type: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder?: string,
    step?: string,
}
export const Input = ({type, value, placeholder = 'input', step = 'any', onChange}: InputProps) => {
    return (
      <input
        autoFocus
        type={type}
        step={step}
        placeholder={placeholder}
        className="input"
        value={value}
        onChange={onChange}
      />
    );
}