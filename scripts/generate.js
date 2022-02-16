#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const templatePath = path.join(__dirname, 'template');
const srcPath = path.join(__dirname, '../src');

const comps = require('../components.json');


const contentReplace = (content, data) => {
  return content.replace(/__COMPONENT_NAME__/g, data.componentName)
    .replace(/__COMPONENT_CLASS_NAME__/g, data.componentClassName)
    .replace('__COMPONENT_FILENAME__', data.componentFileName)
    .replace('__COMPONENT_TAG_NAME__', data.componentFileName)
    .replace('__STORIES_ORDER__', data.storiesOrder)
    .replace(/.tpl$/g, '');

}

const fileGen = (srcPath, distPath, data) => {
  const files = fs.readdirSync(srcPath);
  files.forEach(file => {
    const fileContent = fs.readFileSync(path.join(srcPath, file));
    let fileString = fileContent.toString();
    fileString = contentReplace(fileString, data);
    file = contentReplace(file, data);
    fs.ensureDirSync(distPath);
    fs.writeFileSync(distPath + '/' + file, fileString)
    console.log(distPath + '/' + file)
  })
};

const componentsPath = path.join(srcPath, 'components');
const storiesPath = path.join(srcPath, 'stories');
const typesPath = path.join(__dirname, '../types');
const indexFilePath = path.join(componentsPath, 'index.ts');
const xinUiDFilePath = path.join(typesPath, 'xin-ui.d.ts');
const stories = fs.readdirSync(storiesPath);
const storiesOrder = stories.filter(s => fs.statSync(path.join(storiesPath, s)).isDirectory()).length;


function gen(inputName) {
  if(/^(x|X)in*/i.test(inputName)) {
    console.log(`组件: [${inputName}] 不能以 (x|X)in* 开头，程序内会自动补充，换个名字再试试吧!!!`);
    process.exit(1)
    return;
  }

  if(Object.keys(comps).length) {
    let compKeys = Object.keys(comps);
    let _inputName = inputName.replace(/[-_](\w)/g, function (all, letter) {
      return letter.toUpperCase();
    }).replace(/^(\w)/, function (all, letter) {
      return letter.toUpperCase();
    });

    if(compKeys.includes(`Xin${_inputName}`)) {
      console.log(`组件: [Xin${_inputName}] 已存在，请尝试其他名字再试试!!!`);
      process.exit(1)
      return;
    }
  }

  const data = {
    componentName: inputName.replace(/[-_](\w)/g, function (all, letter) {
      return letter.toUpperCase();
    }).replace(/^(\w)/, function (all, letter) {
      return letter.toUpperCase();
    }),
    componentClassName: inputName,
    componentFileName: inputName,
    componentsXinName: `xin-${inputName}`,
    storiesOrder: storiesOrder
  }

  const indexFile = fs.readFileSync(indexFilePath);
  let indexFileString = indexFile.toString()
  indexFileString = indexFileString.replace(
    /(import\s+.*\s+from\s+.*\n)(\n+[^import])/,
    `$1import Xin${data.componentName} from './xin-${data.componentFileName}/index';\n$2`
  ).replace(
    /(const\s+components\s+=\s+\[.*\n)((.*,\n)+)(.*)(\n\])/,
    `$1$2$4,\n  Xin${data.componentName}$5`
  ).replace(
    /(export\s+\{.*\n)((.*,\n)+)(.*)(\n\})/,
    `$1$2$4,\n  Xin${data.componentName}$5`
  )

  const xinUiDFile = fs.readFileSync(xinUiDFilePath)
  let xinUiDFileString = xinUiDFile.toString();
  xinUiDFileString = xinUiDFileString.replace(
    /(import\s+.*\s+from\s+.*\n)(\n+[^import])/,
    `$1import {Xin${data.componentName}} from './components/xin-${data.componentFileName}';\n$2`
  ).replace(
    /(export\s+\{.*\n)((.*,\n)+)(.*)(\n\})/,
    `$1$2$4,\n  Xin${data.componentName}$5`
  )

  fileGen(path.join(templatePath, 'components'), path.join(componentsPath, data.componentsXinName), data);
  fileGen(path.join(templatePath, 'componentsIndex'), path.join(componentsPath, data.componentsXinName), data);
  fileGen(path.join(templatePath, 'stories'), path.join(storiesPath, data.componentFileName), data);
  fileGen(path.join(templatePath, 'types'), path.join(typesPath, 'components'), data);
  fs.writeFileSync(indexFilePath, indexFileString);
  fs.writeFileSync(xinUiDFilePath, xinUiDFileString);
}

const inputName = process.argv[2];
if (!inputName) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'componentName',
      message: '请输入要创建的组件名称：'
    }
  ]).then(answers => {
    if (answers.componentName) {
      gen(answers.componentName)
    }
  })
} else {
  gen(inputName)
}




