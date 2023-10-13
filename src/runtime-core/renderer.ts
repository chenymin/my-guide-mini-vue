import { isObject } from "../shared/src/index";
import { ShapeFlags } from "../shared/src/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  // TODO 判断vnode 是不是一个 element
  // 是 element 那么就应该处理 element
  // 思考题： 如何去区分是 element 还是 component 类型呢？
  // processElement();
  const { type , shapeFlag } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
    break;
    case Text:
      processText(vnode, container);
    break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }
    break;
  }
 
  console.log(vnode.type);
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function mountElement(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.type));
  const { children, shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }

  const { props } = vnode;
  for (const key in props) {
    const val = props[key];
    const isOn = (key:string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
  }
  container.appendChild(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container);
  })
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(initVnode: any, container) {
  const instance = createComponentInstance(initVnode);

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
  setupComponent(instance);
  setupRenderEffect(instance, initVnode, container);
}

function setupRenderEffect(instance: any, initVnode, container) {
  const {proxy} = instance
  const subTree = instance.render.call(proxy);

  patch(subTree, container);

  initVnode.el = subTree.el;
}
function processFragment(vnode, container) {
  mountChildren(vnode, container);
}

function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.appendChild(textNode);
}

