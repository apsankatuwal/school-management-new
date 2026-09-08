import { GraduationCap } from 'lucide-react'
import CustomButton from './CustomButton'

const Navbar = () => {
  return (

    <header className="flex items-center justify-between border border-blue-100 py-3 px-9">
  
        <div className="flex items-center gap-2  text-2xl font-bold text-emerald-950">
  <GraduationCap size={30} />
            <h1>Evergreen Academy</h1>
        </div>
        

<div className='flex items-center gap-8'>
    <nav className='space-x-8 text-sm text-gray-500 font-medium [&>a]:hover:text-black '>                                                                                         
        <a href='/'>Home</a>
        <a href='/about'>About</a>
        <a href='/curriculum'>Curriculum</a>
        <a href='/admissions'>Admissions</a>
        <a href='/contact'>Contact</a>
    </nav>
  <CustomButton text='PortalLogin' link='/login' />
</div>                                                                                  
 

 </header>
  )
}

export default Navbar
