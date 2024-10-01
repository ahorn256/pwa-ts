import './App.css';
import useInstallPrompt from './useInstallPrompt';
import { IconButton } from '@mui/material';
import * as Icon from '@mui/icons-material';
import BooksApp from './features/books/BooksApp';
import { Route, Routes } from 'react-router-dom';
import FormDialog from './features/books/FormDialog';
import DeletionDialog from './features/books/DeletionDialog';
import NotFound from './NotFound';
import { useState } from 'react';

function App() {
  const installPrompt = useInstallPrompt();
  const [ promptConfirmed, setPromptConfirmed ] = useState(false);

  async function handleInstallButton() {
    if(!installPrompt) {
      return;
    }

    const choice = await installPrompt.prompt();
    choice.outcome === 'accepted' && setPromptConfirmed(true);
  }
  
  return (
    <div className="App">
      <div className="App-content">
        { installPrompt && !promptConfirmed &&
          <div className="App-install-button">
            <IconButton
              onClick={handleInstallButton}>
              <Icon.InstallDesktop />
            </IconButton>
          </div>
        }
 
        <Routes>
          <Route path='/' element={<BooksApp />}>
            <Route path='/new' element={<FormDialog />} />
            <Route path='/edit/:id' element={<FormDialog />} />
            <Route path='/delete/:id' element={<DeletionDialog />} />
          </Route>
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
