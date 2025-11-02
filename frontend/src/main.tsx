import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { store } from "./redux/store"
import "./index.css"
import { Toaster } from 'react-hot-toast';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position = "top-right" reverseOrder={false}/>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
