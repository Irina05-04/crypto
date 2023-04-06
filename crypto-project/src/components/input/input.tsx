type InputProps = {
    type: string,
    value: string,
    placeholder: string,
    onChange: () => void,
    step?: string,
}
export const Input = ({type, value, placeholder, onChange, step}: InputProps) => {
    return (
      <input
        autoFocus
        type={type}
        step={step}
        placeholder={placeholder}
        className="form__input"
        value={value}
        onChange={onChange}
      />
    );
}