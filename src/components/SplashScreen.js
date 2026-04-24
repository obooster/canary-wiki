import { useEffect, useState } from "react";

import logo from "../icon.png"

export default function SplashScreen({ onFinish }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 1500);
    const t2 = setTimeout(() => onFinish(), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div
        className={`transition-all duration-700 ${
          exiting ? "opacity-0 scale-90" : "opacity-100 scale-100"
        }`}
      >
        <img
          src={logo}
          alt="logo"
          className="w-28 h-28 object-contain"
        />
      </div>
    </div>
  );
}