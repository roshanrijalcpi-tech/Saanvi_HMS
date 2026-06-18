function Button({ text, type = "submit" }) {
  return (
    <button
      type={type}
      className="btn btn-primary w-100 mt-2"
    >
      {text}
    </button>
  );
}

export default Button;