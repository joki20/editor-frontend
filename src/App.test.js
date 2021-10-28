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

import { unmountComponentAtNode } from "react-dom";

 import Toolbar from "./components/Toolbar.js"

// // https://testing-library.com/docs/react-testing-library/example-intro

test('Click title and display its corresponding text content on the screen', async () => {
  await render(<App />);
  
  // get element containing text
  await screen.findByText(/Nintendo gör det igen/i)
  // click element
  var clickableTitle = screen.getByText(/Nintendo gör det igen/i);
  await userEvent.click(clickableTitle);
  // expect element containing the following text
  expect(screen.getByText(/Super Mario utsett till tidernas spel/i)).toBeInTheDocument()
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