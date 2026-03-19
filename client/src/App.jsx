import { useEffect } from "react";
import Lenis from "lenis";
import TasksPage from "./pages/TasksPage";
import { Toaster } from "react-hot-toast";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <TasksPage />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#363636",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            borderRadius: "0.75rem",
            padding: "0.75rem 1rem",
          },
          success: {
            iconTheme: {
              primary: "#A2A755",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;