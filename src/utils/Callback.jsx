import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Callback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get("code");
    if (!code) return;

    // Exchange code for tokens
    const exchange = async () => {
      try {
        const resp = await fetch("http://localhost:8080/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              btoa(
                `${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`,
              ),
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: "http://localhost:5173/callback",
          }),
        });

        const data = await resp.json();
        console.log("TOKEN RESPONSE:", data);

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("id_token", data.id_token);

        navigate("/"); // redirect to your app home
      } catch (err) {
        console.error(err);
      }
    };

    exchange();
  });

  return <div>Processing login…</div>;
}
