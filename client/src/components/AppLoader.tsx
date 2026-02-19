import { Logo } from '@/assets'

const AppLoader = () => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-background'>
            <div>
                <img src={Logo} alt="BookMyDoc" className='w-20 h-20 animate-pulse' />
            </div>
        </div>
    )
}

export default AppLoader