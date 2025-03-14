import 'webextension-polyfill';
import AddModifyCspRule from "@src/background/scripts/modify-csp";
import {AddStoreUserTikTokCookiesListener} from "@src/background/scripts/store-user-cookies";
import {BackgroundMessageProxy} from '@extension/message-proxy';
import {AddStoreUserProfileListener} from "@src/background/scripts/store-user-profile";
import {AddPopupRedirect} from "@src/background/scripts/popup-redirect";

const messageProxy = new BackgroundMessageProxy();

AddStoreUserProfileListener(messageProxy);
AddModifyCspRule();
AddStoreUserTikTokCookiesListener();
AddPopupRedirect();