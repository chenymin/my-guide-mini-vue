import { ShapeFlags } from "../shared/src/ShapeFlags";

export function initSlots(instance, children) {
  // instance.slots = Array.isArray(children) ? children : [children]

  const {vnode} = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeObjectSlots(children:any, slots:any) {
  for (const key in children) {
    if (Object.prototype.hasOwnProperty.call(children, key)) {
      const value = children[key];
      slots[key] = (props) => normalizeSlotsValue(value(props));
    }
  }
}

function normalizeSlotsValue(value) {
  return Array.isArray(value) ? value : [value] ;
}