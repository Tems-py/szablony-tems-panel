import {BrowserRouter, Routes, Route} from "react-router";
import {createRoot} from 'react-dom/client'
import './main.css'
import Index from "./routes";
import Panel from "./routes/panel.tsx";
import Navbar from "./components/navbar.tsx";
import Login from "./routes/login.tsx";
import Logout from "./routes/logout.tsx";
import Shop from "./routes/shop.tsx";
import Domain from "./routes/shop/domain.tsx";
import ShopView from "./components/shopView.tsx";
import Logs from "./routes/shop/logs.tsx";
import NotFound from "./routes/notFound.tsx";
import FileSystem from "./routes/shop/fileSystem.tsx";
import Config from "./routes/shop/config.tsx";

const defaultShop = {
    id: Number(0),
    domain: "Ładowanie...",
    date: "...",
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/panel" element={<Panel/>}/>
            <Route path="/" element={<><Navbar/><Index/></>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/shop/:shopId" element={<ShopView page={<Shop shop={defaultShop}/>}/>}/>
            <Route path="/shop/:shopId/domain" element={<ShopView page={<Domain shop={defaultShop}/>}/>}/>
            <Route path="/shop/:shopId/logs" element={<ShopView page={<Logs shop={defaultShop}/>}/>}/>
            <Route path="/shop/:shopId/files" element={<ShopView page={<FileSystem shop={defaultShop}/>}/>}/>
            <Route path="/shop/:shopId/config" element={<ShopView page={<Config shop={defaultShop}/>}/>}/>

            <Route path='*' element={<NotFound />} />
        </Routes>
    </BrowserRouter>,
)
