import { GoogleOAuthProvider } from '@react-oauth/google'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { bootstrapAuth } from './core/http/bootstrapAuth'

const App = () => {
	useEffect(() => {
		bootstrapAuth();
	}, []);
	return (
		<>
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<AppRoutes />

			<Toaster />
		</GoogleOAuthProvider>
		</>
	)
}

export default App