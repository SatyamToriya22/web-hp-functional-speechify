/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];

/**
 *  **TBD:**
 *  Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  Start Parsing inside the body element of the HTMLPage.
 *  A top level readable element is defined as follows:
 *      1. The text node contained in the element should not be empty
 *      2. The element should not be in the ignore list (also referred as the block list)
 *      3. The element should not be a child of another element that has only one child.
 *            For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 *      4. A top level readable element should not contain another top level readable element.
 *            For example: Consider the following HTML document:
 *            <body>
 *              <div id="root"></div>
 *              <div id="content-1">
 *                <article>
 *                  <header>
 *                    <h1 id="title">An Interesting HTML Document</h1>
 *                    <span>
 *                      <address id="test">John Doe</address>
 *                    </span>
 *                  </header>
 *                  <section></section>
 *                </article>
 *              </div>
 *            </body>;
 *            In this case, #content-1 should not be considered as a top level readable element.
 */
// export function getTopLevelReadableElementsOnPage(): HTMLElement[] {}

export function getTopLevelReadableElementsOnPage(): HTMLElement[] {
  const isReadableElement = (element: HTMLElement): boolean => {
    // Ignore elements that are in the block list
    if (IGNORE_LIST.includes(element.tagName)) return false;

    // Ignore elements with empty or whitespace-only text content
    if (!element.textContent || element.textContent.trim() === "") return false;

    return true;
  };

  const isChildOfSingleChildParent = (element: HTMLElement): boolean => {
    const parent = element.parentElement;
    return parent ? parent.children.length === 1 : false;
  };

  const containsTopLevelReadableElement = (parent: HTMLElement): boolean => {
    for (const child of Array.from(parent.children)) {
      if (isReadableElement(child as HTMLElement)) {
        return true;
      }
    }
    return false;
  };

  const result: HTMLElement[] = [];
  const body = document.body;

  const traverse = (element: HTMLElement) => {
    if (!isReadableElement(element)) return;

    // Ignore elements that are children of a single-child parent
    if (isChildOfSingleChildParent(element)) return;

    // Check if the element contains another top-level readable element
    if (containsTopLevelReadableElement(element)) {
      Array.from(element.children).forEach((child) =>
        traverse(child as HTMLElement),
      );
    } else {
      result.push(element);
    }
  };

  Array.from(body.children).forEach((child) => traverse(child as HTMLElement));

  return result;
}
