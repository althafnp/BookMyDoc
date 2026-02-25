import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from 'sonner'

const App = () => {
	return (
		<>
			<AppRoutes />

			<Toaster />
		</>
	)
}

export default App