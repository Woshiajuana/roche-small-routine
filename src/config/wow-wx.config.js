import Config                       from 'config/env.config'
import RouterConfig                 from 'config/router.config'
import StoreConfig                  from 'config/store.config'

let {
    SOURCE_BASE_URL
} = Config;

// 工具配置
export const UtilConfig = {
    SOURCE_BASE_URL,
};

// 插件配置
export const PluginsConfig = {

    // 路由配置模块
    ROUTER: {
        routerConfig: RouterConfig,
    },

    // 存储配置模块
    STORE: {
        storeConfig: StoreConfig,
    },

    // 用户认证模块
    AUTH: {
        // 用户信息存储key配置
        $USER_TOKEN: StoreConfig.$USER_TOKEN,
    },
};
