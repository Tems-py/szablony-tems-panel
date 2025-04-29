import {BrowserRouter, Routes, Route} from "react-router";
import {createRoot} from 'react-dom/client'
import './main.css'
import Index from "./routes";
import Panel from "./routes/panel.tsx";
import Navbar from "./components/navbar.tsx";
import Login from "./routes/login.tsx";
import Logout from "./routes/logout.tsx";
import Shop from "./routes/shop.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/panel" element={<Panel/>}/>
            <Route path="/" element={<><Navbar/><Index/></>}/>
            <Route path="/login" element={<Login/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/shop/:shopId" element={<Shop/>} />
        </Routes>
    </BrowserRouter>,
)
