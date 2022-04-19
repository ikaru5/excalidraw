import { ENV } from "../../constants";
import pkg from "./package.json";
if (process.env.NODE_ENV !== ENV.TEST) {
  /* eslint-disable */
  /* global __webpack_public_path__:writable */
  try {
    __webpack_public_path__ =
      window.EXCALIDRAW_ASSET_PATH ||
      `https://unpkg.com/${pkg.name}@${pkg.version}/dist/`;
  } catch (e) {
    console.warn("Failed to set public path for webpack. No problem if you are using another bundler.");
  }
}
