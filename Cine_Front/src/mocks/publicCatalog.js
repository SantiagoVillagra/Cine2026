// Datos ilustrativos para la etapa visual. No representan una cartelera real ni un DTO de la API.
export const publicCatalogMock = [
  {
    idPelicula: 101,
    titulo: 'La última luz',
    poster: '/posters/la-ultima-luz.svg',
    sinopsis:
      'Una restauradora encuentra una pista inesperada en una antigua sala de cine.',
    duracion: 118,
    clasificacion: 'ATP',
    generos: ['Drama', 'Misterio'],
    funciones: [
      {
        idFuncion: 1001,
        hora: '18:20',
        idioma: 'Español',
        sala: { nombre: 'Sala 1', formato: '2D' },
      },
      {
        idFuncion: 1002,
        hora: '21:10',
        idioma: 'Inglés',
        subtitulada: true,
        sala: { nombre: 'Sala 3', formato: '3D' },
      },
    ],
  },
  {
    idPelicula: 102,
    titulo: 'Órbita de papel',
    poster: '/posters/orbita-de-papel.svg',
    sinopsis:
      'Dos hermanas reconstruyen un viejo observatorio y vuelven a mirar el cielo.',
    duracion: 104,
    clasificacion: 'ATP',
    generos: ['Aventura', 'Familiar'],
    funciones: [
      {
        idFuncion: 1003,
        hora: '17:40',
        idioma: 'Español',
        sala: { nombre: 'Sala 2', formato: '2D' },
      },
      {
        idFuncion: 1004,
        hora: '20:00',
        idioma: 'Inglés',
        subtitulada: true,
        sala: { nombre: 'Sala 3', formato: '3D' },
      },
    ],
  },
  {
    idPelicula: 103,
    titulo: 'Kilómetro cero',
    poster: '/posters/kilometro-cero.svg',
    sinopsis:
      'Un viaje por la ruta reúne a tres desconocidos en una noche decisiva.',
    duracion: 96,
    clasificacion: '+13',
    generos: ['Comedia', 'Drama'],
    funciones: [
      {
        idFuncion: 1005,
        hora: '19:15',
        idioma: 'Español',
        sala: { nombre: 'Sala 1', formato: '2D' },
      },
    ],
  },
  {
    idPelicula: 104,
    titulo: 'La ciudad sumergida',
    poster: '/posters/ciudad-sumergida.svg',
    sinopsis:
      'Una cartógrafa busca el origen de las luces que aparecen bajo el puerto.',
    duracion: 127,
    clasificacion: '+13',
    generos: ['Suspenso', 'Ciencia ficción'],
    funciones: [
      {
        idFuncion: 1006,
        hora: '18:50',
        idioma: 'Inglés',
        subtitulada: true,
        sala: { nombre: 'Sala 3', formato: '3D' },
      },
      {
        idFuncion: 1007,
        hora: '22:00',
        idioma: 'Español',
        sala: { nombre: 'Sala 2', formato: '2D' },
      },
    ],
  },
]

export const featuredMovieIds = [101, 104, 102]
