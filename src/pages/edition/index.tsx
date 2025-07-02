import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This is a simple redirect component to handle /edition routes
const EditionIndexPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard or projects page
    navigate("/");
  }, [navigate]);

  return null;
};

export default EditionIndexPage;
