import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client"; // Import from "react-dom/client" for React 18
import { I18nextProvider } from "react-i18next";
import "antd/dist/antd.css";

import Router from "./router";
import i18n from "./translation";

const App = () => (
    <BrowserRouter>
        <I18nextProvider i18n={i18n}>
            <Router />
        </I18nextProvider>
    </BrowserRouter>
);

// React 18: Use createRoot instead of ReactDOM.render
const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
