import UserRegistration from "./UserRegistration";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
      }}
    >
      <img
        src="/cs-video-logo16x9.png"
        alt="Cornerstone Video Logo"
        style={{
          maxWidth: "300px",
          height: "auto",
        }}
      />
      <UserRegistration />
    </header>
  );
}
