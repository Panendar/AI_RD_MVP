// Runs before every test file: Testing Library's DOM matchers and the browser APIs jsdom does not provide.
import '@testing-library/jest-dom';

// Browser polyfills apply only in jsdom; tests that declare @jest-environment node have no window.
// matchMedia and ResizeObserver go on the Window prototype so they survive a test deleting the instance property.
if (typeof window !== 'undefined') {
  const proto = Object.getPrototypeOf(window) as any;
  if (!window.matchMedia) {
    proto.matchMedia = (query: string) => ({ matches: false, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false });
  }
  if (!(window as any).ResizeObserver) {
    proto.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  }
  if (!window.scrollTo || String(window.scrollTo).includes('not implemented')) window.scrollTo = (() => undefined) as typeof window.scrollTo;
}
