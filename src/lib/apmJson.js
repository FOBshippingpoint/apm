import {
  deleteProperty,
  getProperty,
  hasProperty,
  setProperty,
} from 'dot-prop';
import log from 'electron-log';
import { readJson, writeJson } from 'fs-extra';
import path from 'path';

/**
 * Returns the path of `apm.json`.
 *
 * @param {string} instPath - An installation path
 * @returns {string} The path of `apm.json`
 */
function getPath(instPath) {
  return path.join(instPath, 'apm.json');
}

/**
 * Gets the object parsed from `apm.json`.
 *
 * @param {string} instPath - An installation path
 * @returns {object} An object like `package.json`
 */
async function getApmJson(instPath) {
  try {
    const value = await readJson(getPath(instPath));
    if (typeof value === 'object') {
      return value;
    } else {
      throw new Error('Invalid apm.json.');
    }
  } catch (e) {
    if (e.code !== 'ENOENT') log.error(e);
    return { dataVersion: '3', core: {}, packages: {} };
  }
}

/**
 * Sets and save the object to `apm.json`.
 *
 * @param {string} instPath - An installation path
 * @param {object} object - An object to write
 */
async function setApmJson(instPath, object) {
  await writeJson(getPath(instPath), object, { spaces: 2 });
}

// Functions to be exported

/**
 * Checks whether `apm.json` has the property.
 *
 * @param {string} instPath - An installation path
 * @param {string} path - Key to check existing
 * @returns {boolean} Whether `apm.json` has the property.
 */
async function has(instPath, path) {
  return hasProperty(await getApmJson(instPath), path);
}

/**
 * Gets the value from `apm.json`.
 *
 * @param {string} instPath - An installation path
 * @param {string} path - Key to get value
 * @param {any} [defaultValue] - A value replaced when the property don't exists.
 * @returns {any} The property selected by key.
 */
async function get(instPath, path = '', defaultValue) {
  return getProperty(await getApmJson(instPath), path, defaultValue);
}

/**
 * Sets the value to `apm.json`.
 *
 * @param {string} instPath - An installation path
 * @param {string} path - Key to set value
 * @param {any} [value] - A value to set
 */
async function set(instPath, path, value) {
  const object = setProperty(await getApmJson(instPath), path, value);
  await setApmJson(instPath, object);
}

/**
 * Deletes the value from `apm.json`.
 *
 * @param {string} instPath - An installation path
 * @param {string} path - Key to delete value
 */
async function deleteItem(instPath, path) {
  const object = await getApmJson(instPath);
  deleteProperty(object, path);
  await setApmJson(instPath, object);
}

/**
 * Sets the core version to `apm.json`.
 *
 * @param {string} instPath - An installation path
 * @param {string} program - A name of the program
 * @param {string} version - A version of the program
 */
async function setCore(instPath, program, version) {
  await set(instPath, `core.${program}`, version);
}

/**
 * Adds the information of the package to `apm.json`.
 *
 * @param {string} instPath - An installation path
 * @param {object} packageItem - An information of a package
 */
async function addPackage(instPath, packageItem) {
  await set(instPath, `packages.${packageItem.id}`, {
    id: packageItem.id,
    version: packageItem.info.latestVersion,
  });
}

/**
 * Removes the information of the package from `apm.json`.
 *
 * @param {string} instPath - An installation path
 * @param {object} packageItem - An information of a package
 */
async function removePackage(instPath, packageItem) {
  await deleteItem(instPath, `packages.${packageItem.id}`);
}

const apmJson = {
  getPath,
  has,
  get,
  set,
  delete: deleteItem,
  setCore,
  addPackage,
  removePackage,
};
export default apmJson;
