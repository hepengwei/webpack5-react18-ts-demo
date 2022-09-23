import React from "react";
import AppBg from "components/AppBg";
import Test from "pages/Test";
import "./app.less";

const App = () => {
  return (
    <div className="app_container">
      <AppBg>
        <div className="app_content">
          <h2>webpack5-react18-ts</h2>
          <Test />
        </div>
      </AppBg>
    </div>
  );
};

export default App;
