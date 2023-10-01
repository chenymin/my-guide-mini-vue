import { isObject } from "../shared/src/index";
import { ShapeFlags } from "../shared/src/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  // TODO 判断vnode 是不是一个 element
  // 是 element 那么就应该处理 element
  // 思考题： 如何去区分是 element 还是 component 类型呢？
  // processElement();
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
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
    el.setAttribute(key, val);
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
