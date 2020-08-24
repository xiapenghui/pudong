export function isNull(obj) {
    return undefined === obj || null === obj;
}

export function isEmpty(obj) {
    return isNull(obj) || //空对象
        "" === obj || //空字符串
        !!obj.length; //空数组
}

export function validateNum(num) {
    return !isEmpty(num) ||
        !Number.isNaN(Number(num));
}