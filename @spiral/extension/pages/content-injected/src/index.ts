import {InjectedMessageProxy,} from "@extension/message-proxy";
import {getContextScript} from "@src/contexts/find-context";
import {querySelectorHide, querySelectorWait} from "@src/utils";

document.__Spiral__ = {MessageProxy: new InjectedMessageProxy()};
document.querySelectorWait = querySelectorWait;
document.querySelectorHide = querySelectorHide;

getContextScript()?.();

