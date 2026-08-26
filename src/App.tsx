import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyle, Watermark } from './styles/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';
import SocialModal from './components/SocialModal';
import InstallPWA from './components/InstallPWA';
import ScrollToTop from './components/ScrollToTop';
import { useAppProtection } from './hooks/useAppProtection';
import Home from './pages/Home';
import PecasCompativeis from './pages/PecasCompativeis';
import MapaFusiveis from './pages/MapaFusiveis';
import TabelaCores from './pages/TabelaCores';
import Sobre from './pages/Sobre';
import Diagnosticos from './pages/Diagnosticos';
import ProdutosShopee from './pages/ProdutosShopee';
import ListaNegra from './pages/ListaNegra';
import Login from './pages/admin/Login';
import LoginPublico from './pages/LoginPublico';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import Onboarding from './pages/Onboarding';
import Feed from './pages/Feed';
import MinhaGaragem from './pages/MinhaGaragem';
import EditarPerfil from './pages/EditarPerfil';
import EditarCarro from './pages/EditarCarro';
import PerfilPublico from './pages/PerfilPublico';
import AdminConfig from './pages/admin/AdminConfig';
import AdminProdutos from './pages/admin/AdminProdutos';
import AdminProdutoForm from './pages/admin/AdminProdutoForm';
import AdminListaNegra from './pages/admin/AdminListaNegra';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminTags from './pages/admin/AdminTags';

const AppContent: React.FC = () => {
  const { showModal, closeModal } = useAppProtection();

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pecas" element={<PecasCompativeis />} />
          <Route path="/fusiveis" element={<MapaFusiveis />} />
          <Route path="/cores" element={<TabelaCores />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/produtos" element={<ProdutosShopee />} />
          <Route path="/diag-sys-internal-2025" element={<Diagnosticos />} />
          <Route path="/lista-negra" element={<ListaNegra />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/login" element={<LoginPublico />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/minha-garagem" element={<MinhaGaragem />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
          <Route path="/editar-carro/:id" element={<EditarCarro />} />
          <Route path="/u/:username" element={<PerfilPublico />} />
          <Route path="/admin/produtos" element={<AdminProdutos />} />
          <Route path="/admin/produtos/novo" element={<AdminProdutoForm />} />
          <Route path="/admin/produtos/:id" element={<AdminProdutoForm />} />
          <Route path="/admin/categorias" element={<AdminCategorias />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/lista-negra" element={<AdminListaNegra />} />
          <Route path="/admin/tags" element={<AdminTags />} />
          <Route path="/admin/configuracoes" element={<AdminConfig />} />
        </Routes>
      </main>
      <Footer />
      <Watermark>
        © 2025 Falando de GTI - Todos os direitos reservados
      </Watermark>
      
      <InstallPWA />
      {showModal && <SocialModal onClose={closeModal} />}
    </>
  );
};

function App() {
  React.useEffect(() => {
    // Configuração do Google Analytics
    if (process.env.REACT_APP_GA_TRACKING_ID) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_TRACKING_ID}`;
      document.head.appendChild(script);

      window.gtag = window.gtag || function() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID);
    }

    // Configuração do Meta Pixel
    if (process.env.REACT_APP_META_PIXEL_ID) {
      window.fbq = window.fbq || function() {
        const args = Array.prototype.slice.call(arguments);
        window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, args) : window.fbq.queue.push(args);
      };
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = '2.0';
      window.fbq.queue = [];
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
      
      window.fbq('init', process.env.REACT_APP_META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }, []);

  return (
    <Router>
      <GlobalStyle />
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
