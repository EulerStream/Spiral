import {ProxyEventSource} from "@extension/message-proxy/lib/base-proxy";
import {blockKeydownKeys, querySelectorCreateHideStyle} from "@src/contexts/embed/utils";


function convertPageToEmbed() {
  const includeChat = new URL(window.location.href).searchParams.get('include-comments') === '1';

  /** Elements that need to be hidden **/
  const style = querySelectorCreateHideStyle(
      'div[class*="DivSideNavPlaceholderContainer"]',
      '#spiral',
      'div[class*="DivGiftListHorizontalContainer"]',
      'div[class*="DivRecommendedLives"]',
      'div[class*="DivTopViewersContainer"]',
      'div[class*="DivLiveRoomBanner"]',
      'div[class*="DivChatRoomHeaderIconContainer"]',
      'div[class*="DivCommentContainer"]',
      'div[class*="DivLikeBtnWrapper"]',
      'div[class*="DivLiveRoomSwitchButton"]',
      'div[class*="DivBottomPlayerAnimationContainer"]',
      'div[class*="DivChatRoomHeader"]',
      'div[data-e2e="more-action-button"]',
      'div[class*="DivUserCardContainer"]'
  );

  /** Elements that need to be modified **/
  style.innerText += `
       #app,
       body, 
       div[class*="DivLiveContainer"],
       div[class*="DivChatRoomAnimationContainer"], 
       main[class*="MainLiveLayoutContainer"],
       div[class*="DivBodyContainer"] {
          height: unset !important;
          min-height: unset !important;           
       }
       
       div[class*="DivLiveRoomPlayContainer"], div[class*="DivLiveRoomContent"] {
         height: 100svh;
       }
       
       div[class*="DivChatRoomAnimationContainer"] {
         max-height: 100vh;
       }
       
       div[class*="DivChatRoomContent"] {
         flex-grow: 1;
       }
       
       div[class*="DivEnterMessage"] {
         margin-top: 15px;
         margin-bottom: 15px;
       }
       
       .xgplayer, div[class*="DivChatRoomContainer"] {
         background: oklch(.145 0 0);
       }
      
       span[class*="SpanEllipsisName"], span[class*="SpanNickName"], div[class*="DivChatMessage"] img {
         cursor: default;
         text-decoration: none !important;
       }

       
  `;

  /** Hide the chat if requested **/
  if (!includeChat) {
    style.innerText += `
      div[class*="DivLiveContent"] {
        width: 100% !important;
      }
      div[class*="DivChatRoomAnimationContainer"] {
        display: none !important;
      }
    `;
  }

  blockKeydownKeys(
      'ArrowUp',
      'ArrowDown',
  );

  document.head.appendChild(style);
  document.__Spiral__.MessageProxy.emit('tiktok-embed-ready', ProxyEventSource.BACKGROUND, {});
  document.body.style.opacity = '1';
}


function embedContextScript() {
  document.body.style.opacity = '0';
  document.querySelectorWait('div[class*="DivLiveRoomPlayerWrapper"]', 5000, 500)
      .then(() => setTimeout(() => convertPageToEmbed(), 1000))
      .catch(() => document.__Spiral__.MessageProxy.emit('tiktok-embed-failed', ProxyEventSource.BACKGROUND, {}));

}


export {embedContextScript};