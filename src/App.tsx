import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import Ajustes from './pages/Ajustes';
import Historial from './pages/Historial';
import TramitesLista from './pages/tramites/TramitesLista';
import TramiteWizard from './pages/tramites/TramiteWizard';
import AulaLista from './pages/aula/AulaLista';
import ProgramacionWizard from './pages/aula/ProgramacionWizard';
import RubricaWizard from './pages/aula/RubricaWizard';
import CentroLista from './pages/centro/CentroLista';
import ActaWizard from './pages/centro/ActaWizard';
import EsqueletoWizard from './pages/centro/EsqueletoWizard';
import FamiliasWizard from './pages/familias/FamiliasWizard';
import CalendarioPage from './pages/CalendarioPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/tramites" element={<TramitesLista />} />
        <Route path="/tramites/:id" element={<TramiteWizard />} />
        <Route path="/aula" element={<AulaLista />} />
        <Route path="/aula/programacion" element={<ProgramacionWizard />} />
        <Route path="/aula/rubrica" element={<RubricaWizard />} />
        <Route path="/centro" element={<CentroLista />} />
        <Route path="/centro/acta" element={<ActaWizard />} />
        <Route path="/centro/esqueleto" element={<EsqueletoWizard />} />
        <Route path="/familias" element={<FamiliasWizard />} />
        <Route path="/calendario" element={<CalendarioPage />} />
      </Route>
    </Routes>
  );
}
