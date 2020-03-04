/* eslint-disable no-unused-vars */

/**
 * 事件委托
 *
 * 好处：
 * 1. 不需要在每个子元素上绑定回调，节省内存
 * 2. 子元素频繁增删不需要重复绑定事件
 *
 * 局限性
 * 1. 有些事件没有冒泡，例如 focus，blur
 * 2. 任何子元素触发被代理的事件都会触发 wrappedListener，像 mouseover 这类会在代理元素内频繁触发的事件就不适合用事件委托，
 * 单独绑定可以减少很多没必要的 wrappedListener 调用
 *
 * @param {string} event 事件名
 * @param {string} parentSelector 代理元素的选择器
 * @param {string} targetSelector 被代理元素的选择器
 * @param {string} listener 事件回调
 */
function eventDelegate(event, parentSelector, targetSelector, listener) {
    function wrappedListener(event, ...args) {
        let { target } = event;
        const { currentTarget } = event;

        while (target !== currentTarget) {
            if (target.matches(targetSelector)) {
                listener.call(target, event, ...args);
            }
            target = target.parentNode;
        }
    }

    document
        .querySelectorAll(parentSelector)
        .forEach(parent => parent.addEventListener(event, wrappedListener));
}
