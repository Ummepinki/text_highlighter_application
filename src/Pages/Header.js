import React from "react";

const Header = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "10vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ color: "black", fontWeight: "500", fontSize: "20px" }}>
        Text Highlighter Application
      </p>
    </div>
  );
};

export default Header;
