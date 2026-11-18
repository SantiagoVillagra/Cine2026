import { Outlet } from 'react-router-dom'
import SectionLayout from './SectionLayout.jsx'

function AdminLayout() {
  return (
    <SectionLayout section="Administración">
      <Outlet />
    </SectionLayout>
  )
}

export default AdminLayout
