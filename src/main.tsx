import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import About from './pages/About';
import Index from './pages/Index';
import { createBrowserRouter } from "react-router-dom";
import NotFound from './pages/NotFound.tsx';
import LiturgyEditor from './pages/LiturgyEditor.tsx';
import ViewLiturgy from './pages/ViewLiturgy.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />
  },
  {
    path: "/edit",
    element: <LiturgyEditor />
  },
  {
    path: "/view/:id",
    element: <ViewLiturgy />
  },
  {
    path: "/about",
    element: <About />
  }
]);

createRoot(document.getElementById("root")!).render(<App />);
