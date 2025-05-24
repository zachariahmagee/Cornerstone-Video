
interface LikedIconProps {
  liked: boolean;
  onToggle: () => void;
};

export default function LikeIcon({ liked, onToggle }: LikedIconProps) {
  return <button
    onClick={onToggle}
    style={{
      background: "none",
      border: "none",
      fontSize: "1.25rem",
      cursor: "pointer",
      color: liked ? "#ffcc00" : "#777",
    }}
    aria-label={liked ? "Unlike" : "Like"}
    title={liked ? "Unlike" : "Like"}
  >
    { liked ? "❤️" : "🤍" }
  </button>
}