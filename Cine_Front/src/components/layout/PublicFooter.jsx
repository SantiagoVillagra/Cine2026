import { Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';

function PublicFooter() {
  return (
    <footer className='border-t border-border bg-surface'>
      <div className='mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8'>
        <div>
          <Link
            to='/'
            className='inline-flex items-center gap-2 font-semibold text-text-primary'
          >
            <Clapperboard
              size={18}
              className='text-primary'
              aria-hidden='true'
            />
            Cine2026
          </Link>
          <p className='mt-3 max-w-md text-sm leading-6 text-text-secondary'>
            Proyecto académico de gestión de cine. La cartelera visible en esta etapa utiliza información ilustrativa.
          </p>
          <p className='mt-3 text-xs text-text-secondary'>Interfaz desarrollada con React, Vite y Tailwind CSS.</p>
        </div>
      </div>
      <div className='border-t border-border/70 px-4 py-4 text-center text-xs text-text-secondary'>
        Cine2026 · Proyecto de desarrollo
      </div>
    </footer>
  );
}

export default PublicFooter;
