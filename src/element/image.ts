// -----------------------------------------------------------------------------
// ExcalidrawImageElement & related helpers
// -----------------------------------------------------------------------------

import { MIME_TYPES, SVG_NS } from "../constants";
import { t } from "../i18n";
import { AppClassProperties, DataURL, BinaryFiles } from "../types";
import { isInitializedImageElement } from "./typeChecks";
import {
  ExcalidrawElement,
  FileId,
  InitializedExcalidrawImageElement,
} from "./types";
import {getDataURL, SVGStringToFile} from "../data/blob";

export const loadHTMLImageElement = (dataURL: DataURL) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => {
      reject(error);
    };
    image.src = dataURL;
  });
};

/** NOTE: updates cache even if already populated with given image. Thus,
 * you should filter out the images upstream if you want to optimize this. */
export const updateImageCache = async ({
  fileIds,
  files,
  imageCache,
}: {
  fileIds: FileId[];
  files: BinaryFiles;
  imageCache: AppClassProperties["imageCache"];
}) => {
  const updatedFiles = new Map<FileId, true>();
  const erroredFiles = new Map<FileId, true>();

  await Promise.all(
    fileIds.reduce((promises, fileId) => {
      const fileData = files[fileId as string];
      if (fileData && !updatedFiles.has(fileId)) {
        updatedFiles.set(fileId, true);
        return promises.concat(
          (async () => {
            try {
              if (fileData.mimeType === MIME_TYPES.binary) {
                throw new Error("Only images can be added to ImageCache");
              }

              const imagePromise = loadHTMLImageElement(fileData.dataURL);
              const data = {
                image: imagePromise,
                mimeType: fileData.mimeType,
              } as const;
              // store the promise immediately to indicate there's an in-progress
              // initialization
              imageCache.set(fileId, data);

              const image = await imagePromise;

              imageCache.set(fileId, { ...data, image });
            } catch (error: any) {
              erroredFiles.set(fileId, true);
            }
          })(),
        );
      }
      return promises;
    }, [] as Promise<any>[]),
  );

  return {
    imageCache,
    /** includes errored files because they cache was updated nonetheless */
    updatedFiles,
    /** files that failed when creating HTMLImageElement */
    erroredFiles,
  };
};

export const updateLatexImageCache = async({elements, latexImageCache}: { elements: readonly InitializedExcalidrawImageElement[]; latexImageCache: AppClassProperties["latexImageCache"]; }
) => {
  await Promise.all(
    elements.reduce((promises, element) => {
      const latex = element.latex;
      if ("string" === typeof latex && !latexImageCache.get(latex)?.image) {
        return promises.concat(
          (async () => {
            const latexSVG = window.MathJax.tex2svg(latex).childNodes[0].outerHTML;
            const file = new File([latexSVG], "tmpfile.svg", {
              type: MIME_TYPES.svg,
              lastModified: new Date().getTime(),
            });
            let newFile;
            try {
              newFile = SVGStringToFile(
                await normalizeSVG(await file.text()),
                file.name,
              );
            } catch (error: any) {
              console.warn(error);
              throw new Error(t("errors.latexSvgImageInsertError"));
            }

            const dataURL = await getDataURL(newFile);

            const imagePromise = loadHTMLImageElement(dataURL);

            const data = {
              image: imagePromise,
              mimeType: MIME_TYPES.svg,
            } as const;

            // store the promise immediately to indicate there's an in-progress
            // initialization
            latexImageCache.set(latex, data);

            const image = await imagePromise;

            latexImageCache.set(latex, {...data, image});
          })(),
        );
      }
      return promises;
    }, [] as Promise<any>[])
  );

  return latexImageCache;
}

export const getInitializedImageElements = (
  elements: readonly ExcalidrawElement[],
) =>
  elements.filter((element) =>
    isInitializedImageElement(element),
  ) as InitializedExcalidrawImageElement[];

export const isHTMLSVGElement = (node: Node | null): node is SVGElement => {
  // lower-casing due to XML/HTML convention differences
  // https://johnresig.com/blog/nodename-case-sensitivity
  return node?.nodeName.toLowerCase() === "svg";
};

export const normalizeSVG = async (SVGString: string) => {
  const doc = new DOMParser().parseFromString(SVGString, MIME_TYPES.svg);
  const svg = doc.querySelector("svg");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode || !isHTMLSVGElement(svg)) {
    throw new Error(t("errors.invalidSVGString"));
  } else {
    if (!svg.hasAttribute("xmlns")) {
      svg.setAttribute("xmlns", SVG_NS);
    }

    if (!svg.hasAttribute("width") || !svg.hasAttribute("height")) {
      const viewBox = svg.getAttribute("viewBox");
      let width = svg.getAttribute("width") || "50";
      let height = svg.getAttribute("height") || "50";
      if (viewBox) {
        const match = viewBox.match(/\d+ +\d+ +(\d+) +(\d+)/);
        if (match) {
          [, width, height] = match;
        }
      }
      svg.setAttribute("width", width);
      svg.setAttribute("height", height);
    }

    return svg.outerHTML;
  }
};
