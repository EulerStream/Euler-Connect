import {createRoot} from "react-dom/client";
import "./styles/globals.css";
import {HashRouter as BrowserRouter, Route, Routes} from "react-router";
import PageLayout from "@src/layout";
import Settings from "@src/app/Home";
import {BackgroundMessageProxy} from "@extension/message-proxy";
import Popup from "@src/app/Popup";

const element = document.querySelector("#app-container")!;
const root = createRoot(element);

document.__Background__ = {MessageProxy: new BackgroundMessageProxy()}

root.render(
    <BrowserRouter>
      <Routes>
        <Route
            path={"/"}
            element={
              <PageLayout
                  title={"Euler Connect"}
                  description={"Euler Connect Dashboard Page"}
                  element={<Settings/>}
              />
            }
        />
        <Route
            path={"/popup/:uniqueId"}
            element={<Popup/>}
        />
      </Routes>
    </BrowserRouter>,
);
