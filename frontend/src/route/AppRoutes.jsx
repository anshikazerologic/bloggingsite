import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SinglePost from "../pages/SinglePost";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<SinglePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;