const fs = require('fs');
const path = require('path');
const componentName = process.argv[2].split('/')[1];
const folderName = componentName.toLowerCase();
const componentPath = path.join(__dirname, 'src', process.argv[2].split("/")[0], folderName);
const componentFile = path.join(componentPath, `index.jsx`);
const componentContent = `import React, { useEffect } from "react";
import { connect } from "react-redux";
import styles from "./index.module.css";
const ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} = (props) => {
  useEffect(() => {
    console.log(props.Data);
  }, [props.Data]);
  return <div></div>;
};

export default connect(mapStateToProps)(${componentName.charAt(0).toUpperCase() + componentName.slice(1)});
`;

const componentCss = path.join(componentPath, `index.module.css`);
const cssContent = `.wrapper {
    
}
`;

fs.mkdirSync(componentPath);
fs.writeFileSync
  (componentFile, componentContent);
fs.writeFileSync(componentCss, cssContent);
console.log(`Component ${componentName} created successfully`);
