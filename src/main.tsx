
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';

import AuthProvider from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <Toaster
            position="top-right"
            reverseOrder={false}
        />
    
        <RouterProvider router={router}/>
    </AuthProvider>
)
