import { useNavigate } from "react-router-dom";

export default function CustomButton({ text, link, className = "" }) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(link)} className={`primary ${className}`}>
      {text}
    </button>
  );
}