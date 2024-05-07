import { useAuth0 } from '@auth0/auth0-react'

export function Profile () {
  const { user } = useAuth0()
  const formatedName = user?.name?.split(' ').slice(0, 2).join(' ')

  return (
    <article
      title={user?.name}
      aria-label={user?.name}
      className='flex justify-between items-center rounded-md group'
    >
      <figure className='flex justify-center items-center space-x-2 group-hover:space-x-3'>
        <img
          width='50'
          height='50'
          src={user?.picture}
          alt={`avatar of the user ${formatedName}`}
          className='w-10 h-10 rounded-full'
          style={{ aspectRatio: 50 / 50, objectFit: 'cover' }}
        />
        <figcaption className='text-gray-700 font-semibold text-sm group-hover:text-gray-900 group-hover:scale-105 ease-in-out duration-300'></figcaption>
      </figure>
    </article>
  )
}
