import { ShapeFlags } from "../shared/src/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container, null);
}

function patch(vnode, container, parentComponent) {
  // TODO 判断vnode 是不是一个 element
  // 是 element 那么就应该处理 element
  // 思考题： 如何去区分是 element 还是 component 类型呢？
  // processElement();
  const { type , shapeFlag } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
    break;
    case Text:
      processText(vnode, container);
    break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent);
      }
    break;
  }
 }

function processElement(vnode, container, parentComponent) {
  mountElement(vnode, container, parentComponent);
}

function mountElement(vnode, container, parentComponent) {
  const el = (vnode.el = document.createElement(vnode.type));
  const { children, shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent);
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

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach(v => {
    patch(v, container, parentComponent);
  })
}

function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}

function mountComponent(initVnode: any, container, parentComponent) {
  const instance = createComponentInstance(initVnode, parentComponent);

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
  setupComponent(instance);
  setupRenderEffect(instance, initVnode, container);
}

function setupRenderEffect(instance: any, initVnode, container) {
  const {proxy} = instance
  const subTree = instance.render.call(proxy);

  patch(subTree, container, instance);

  initVnode.el = subTree.el;
}
function processFragment(vnode, container, parentComponent) {
  mountChildren(vnode, container, parentComponent);
}

function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.appendChild(textNode);
}

