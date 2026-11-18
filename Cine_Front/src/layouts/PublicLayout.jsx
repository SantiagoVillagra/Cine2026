import { Outlet } from 'react-router-dom'
import PublicFooter from '../components/layout/PublicFooter.jsx'
import PublicNavbar from '../components/layout/PublicNavbar.jsx'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <PublicNavbar />
      <Outlet />
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
