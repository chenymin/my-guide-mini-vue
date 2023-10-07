export const extend = Object.assign;

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue);
};

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

// add-foo -> addFoo;
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c:string) => {
    return c ? c.toUpperCase() : '';
  })
}
// add =》 Add
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitalize(str) : ''
}