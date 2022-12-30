import { expect, test, jest } from '@jest/globals';

import { message } from '../src/lib/buttonTransition';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

test('primary class changed', () => {
  const btn = document.createElement('button');
  btn.classList.add('btn-primary');
  message(btn, 'hello', 'newtype');
  expect.any(btn.classList);
  expect(btn.classList.contains('btn-newtype')).toBeTruthy();
  expect(setTimeout).toBeCalledTimes(1);
  expect(setTimeout).toBeCalledWith(expect.any(Function), 3000);
  jest.runAllTimers();
  expect(btn.classList.contains('btn-primary')).toBeTruthy();
});

test('outline class changed', () => {
  const btn = document.createElement('button');
  btn.classList.add('btn-outline-primary');
  message(btn, 'hello', 'newtype');
  expect.any(btn.classList);
  expect(btn.classList.contains('btn-outline-newtype')).toBeTruthy();
  jest.runAllTimers();
  expect(btn.classList.contains('btn-outline-primary')).toBeTruthy();
});

test('normal and outline class changed', () => {
  const btn = document.createElement('button');
  btn.classList.add('btn-outline-primary');
  btn.classList.add('btn-primary');
  message(btn, 'hello', 'newtype');
  expect.any(btn.classList);
  expect(btn.classList.contains('btn-newtype')).toBeTruthy();
  expect(btn.classList.contains('btn-outline-newtype')).toBeFalsy();
  jest.runAllTimers();
  expect(btn.classList.contains('btn-primary')).toBeTruthy();
});

test('innerText message', () => {
  const btn = document.createElement('button');
  btn.classList.add('btn-primary');
  message(btn, 'hello');
  expect(btn.classList.contains('btn-primary')).toBeTruthy();
});
