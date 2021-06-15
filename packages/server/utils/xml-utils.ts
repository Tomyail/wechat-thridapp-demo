import { Element, ElementCompact } from "xml-js";
export const findChildElementByName = (
  element: Element | ElementCompact,
  name: string
) => {
  return element.elements.find((ele: Element) => ele.name === name);
};

export const getXmlCDATA = (root: any, name: string) => {
  const ToUserName: Element = root.elements[0].elements.find(
    (ele: Element) => ele.name === name
  );

  if (ToUserName) {
    const { elements } = ToUserName;
    if (elements) {
      const [{ type, cdata }] = elements;
      return cdata;
    }
  }
};

export const getXmlValue = (root: any, name: string) => {
  const target: Element = root.elements[0].elements.find(
    (ele: Element) => ele.name === name
  );

  if (target) {
    const { elements } = target;
    if (elements) {
      const [{ type, text }] = elements;
      return text;
    }
  }
};
