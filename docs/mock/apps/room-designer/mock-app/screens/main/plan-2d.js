// S02 2D plan editor (REQ-358 to REQ-363, REQ-366; Mocks 1-7).
import { STYLE, header, catalog, plan, panel, popup, jsonStrip } from './_kit.js?v=2';

export const meta = { code: 'S02', name: '2D plan', side: 'main', icon: 'home', roles: ['homeowner', 'designer'] };

export function render({ data }) {
  return `${STYLE}<div class="rd">
    ${header(data, 'S02')}
    <div class="rd-grid">
      ${catalog(data)}
      ${plan(data)}
      ${panel(data)}
    </div>
    ${jsonStrip(data)}
    ${popup(data)}
  </div>`;
}
