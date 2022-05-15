
const INITIAL_STATE = {
      size: {
            isMobile: true,
            width: 0,
            height: 0,
            scrollbar: 0
      },
      scroll: {
            y: 0,
            x: 0,
            direction: null,
            last: {
                  y: 0,
                  x: 0,
            }
      },
      click: {
            e: null,
            x: null,
            y: null
      }
}

const MOBILE_WIDTH = 768;

export const state = () => (INITIAL_STATE);

export const mutations = {
      setSizing(state) {
            if (document === undefined) {
                  state = INITIAL_STATE
                  return
            }
            const width = document.documentElement.clientWidth
            const height = document.documentElement.clientHeight
            const isMobile = width < MOBILE_WIDTH
            const outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.overflow = 'scroll'; // forcing scrollbar to appear
            outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
            document.body.appendChild(outer);
            const inner = document.createElement('div');
            outer.appendChild(inner);

            const scrollbar = (outer.offsetWidth - inner.offsetWidth);
      
            outer.parentNode.removeChild(outer);
            state.size = Object.assign({}, state.size, { width, height, isMobile, scrollbar })
      },
      setScrolling(state) {
            const diff = (state.scroll.last.y - window.scrollY) * (state.scroll.last.y - window.scrollY < 0 ? -1 : 1);
            if (diff > 40) {
                  const scroll = {
                        x: window.scrollX,
                        y: window.scrollY,
                        direction: window.scrollY > state.scroll.y ? 'down' : 'up',
                        last: {
                              y: state.scroll.y,
                              x: state.scroll.x
                        }
                  }
                  state.scroll = Object.assign({}, state.scroll, scroll)
            }
      },
      setClick(state, event) {
            const e = event || window.event;
            let x = e.pageX;
            let y = e.pageY;

            if (x === undefined) {
                  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            state.click = Object.assign({}, state.click, { e, x, y })
      }
}