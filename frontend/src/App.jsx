import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login" ;
import Register from "./pages/register";
import Header from "./components/Header";

function App() {
  return (
  <Router>
    <Toaster/>
    <Header/>
    <Routes>
      <Route path = "/login"element ={<Login/>} />
      <Route path = "/register"element ={<Register/>} />

    </Routes>
  </Router>
  )
}

export default App;
