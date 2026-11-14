import { Outlet } from 'react-router-dom'
import SectionLayout from './SectionLayout.jsx'

function ClientLayout() {
  return (
    <SectionLayout section="Área de clientes">
      <Outlet />
    </SectionLayout>
  )
}

export default ClientLayout
