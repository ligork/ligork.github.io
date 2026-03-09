// autoload.js - Live2D 看板娘自动加载器
// 配置地址: https://ligork.github.io/live2d/

(function() {
    'use strict';
    
    // ===== 移动端检测 =====
    function isMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
        const isSmallScreen = window.innerWidth < 768;
        return mobileRegex.test(userAgent) || (isSmallScreen && 'ontouchstart' in window);
    }
    
    // 移动端直接退出
    if (isMobile()) {
        console.log('[Live2D] 移动端设备 detected，看板娘已禁用');
        return;
    }
    
    // ===== 配置 =====
    const config = {
        // 你的看板娘资源路径
        basePath: 'https://ligork.github.io/live2d/',
        // 模型 API 地址
        modelAPI: 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/model/',
        debug: false
    };
    
    // ===== 加载资源 =====
    const resources = [
        { type: 'css', url: config.basePath + 'waifu.css' },
        // 使用 CDN 加载 live2d.min.js，不需要本地文件
        { type: 'js', url: 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/live2d.min.js' },
        { type: 'js', url: config.basePath + 'waifu-tips.js' }
    ];
    
    async function loadResources() {
        for (const res of resources) {
            await new Promise((resolve) => {
                let el;
                if (res.type === 'css') {
                    el = document.createElement('link');
                    el.rel = 'stylesheet';
                    el.href = res.url;
                } else {
                    el = document.createElement('script');
                    el.src = res.url;
                }
                el.onload = resolve;
                el.onerror = () => { console.warn('[Live2D] 加载失败:', res.url); resolve(); };
                document.head.appendChild(el);
            });
        }
        initLive2D();
    }
    
    function initLive2D() {
        if (typeof initWidget !== 'function') {
            console.error('[Live2D] waifu-tips.js 未加载');
            return;
        }
        initWidget({
            waifuPath: config.basePath + 'waifu-tips.json',
            cdnPath: config.modelAPI,
            tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
            drag: true,
            debug: config.debug
        });
        console.log('[Live2D] 看板娘初始化完成');
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadResources);
    } else {
        loadResources();
    }
})();
