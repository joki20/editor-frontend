/**
 * @jest-environment jsdom
 */

//  import React from 'react';
//  import { unmountComponentAtNode } from 'react-dom';
// import { render, fireEvent, screen, waitFor } from '@testing-library/react'; // functions render and screen
// import '@testing-library/dom';
// import userEvent from '@testing-library/user-event';
// import '@testing-library/jest-dom';
// import "regenerator-runtime/runtime.js";

import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import App from "./App.js";
import FileSaver from 'file-saver';
jest.mock('file-saver', ()=>({saveAs: jest.fn()}))

import { unmountComponentAtNode } from "react-dom";

 import Toolbar from "./components/Toolbar.js"

// // https://testing-library.com/docs/react-testing-library/example-intro

test('Click title and display its corresponding text content on the screen', async () => {
  await render(<App />);
  
  // get element containing text
  await screen.findByText(/Login/i)
  // click element
  var clickableTitle = screen.getByText(/Login/i);
  await userEvent.click(clickableTitle);
  // expect element containing the following text
  expect(screen.getByText(/joki20@student.bth.se is logged in/i)).toBeInTheDocument()
});


test('Download PDF', async () => {
  await render(<App />);

  jest.mock('file-saver', () => ({ saveAs: jest.fn() }))
  
  global.Blob = function (content, options){return  ({content, options})}
  
  // get element containing text
  await screen.findByText(/Login/i)
  // click element
  var clickableTitle = screen.getByText(/Login/i);
  await userEvent.click(clickableTitle);
  // expect element containing the following text
  await screen.findByText(/Create PDF/i)

  var downloadPDFButton = screen.getByText(/Create PDF/i);

      const link = {
        click: jest.fn()
      };
  jest.spyOn(document, "createElement").mockImplementation(() => link);
  
  await userEvent.click(downloadPDFButton);
  
  expect(link.download).toEqual("myfile.pdf");
  
});

test('Saving existing title will display Title content updated', async () => {
await render(<App />);
  
  // get element containing text
  await screen.findByText(/Nintendo gör det igen/i)
  // click element
  var clickableTitle = screen.getByText(/Nintendo gör det igen/i);
  // click title so title goes into input
  await userEvent.click(clickableTitle);
  // click save button
  await userEvent.click(document.getElementsByTagName("button")[0])
  // expect element containing the following text
  expect(screen.getByText(/Title content updated/i)).toBeInTheDocument()

  createDownload('content', 'filename', 'extension')
expect(FileSaver.saveAs).toHaveBeenCalledWith(
  {content:'content', options: { type: 'application/octet-stream' }}, 
  'filename.extension'
)
});


test('Create string of 10 randomly chosen letters/numbers to create new title', async () => {
  await render(<App />);

  // create random title
  var newTitle           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    newTitle += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  // wait until title input renders, then insert new random title
  await screen.getByLabelText('inputLable');
  document.getElementsByClassName("titleInput")[0].value = newTitle;
  var saveBtn = document.getElementsByTagName('button')[0];

  userEvent.click(saveBtn);

  expect(screen.getByText(/New entry created/i)).toBeInTheDocument();
})