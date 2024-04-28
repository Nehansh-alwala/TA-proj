import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
// import {SessionContextProvider} from "@supabase/auth-helpers-react";
// import {createClient} from '@supabase/supabase-js'


// const supabase=createClient("https://tnbwpgqqregwtzbacppk.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYndwZ3FxcmVnd3R6YmFjcHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwNjczOTQsImV4cCI6MjAyNDY0MzM5NH0.aa3B9sJydwJGLk-rHw-MNC_VjWD4TRE6-HS2G79f_dg")

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Notifications />
    <App />
    {/* <SessionContextProvider supabaseClient={supabase}> */}
      
    {/* </SessionContextProvider> */}
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
