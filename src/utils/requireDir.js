const Path = require('path');
const fs = require('fs');

const parentFile = module.parent.filename;
const parentDir = Path.dirname(parentFile);
// 清除缓存确保每次导入该模块是 module.parent 都是当时导入的模块
delete require.cache[__filename];

function requireDir(dir = '.', opts = {}) {
    const defaultOptions = {
        // eslint-disable-next-line node/no-deprecated-api
        extensions: Object.keys(require.extensions),
        duplicates: false,
        recurse: false,
        noCache: false,
        mapKey: undefined,
        mapValue: undefined,
    };
    opts = { ...defaultOptions, ...opts };

    // 调用文件的文件夹
    dir = Path.resolve(parentDir, dir);
    const files = fs.readdirSync(dir);
    const filesForBase = {};

    files.forEach(file => {
        const ext = Path.extname(file);
        const base = Path.basename(file, ext);

        (filesForBase[base] = filesForBase[base] || []).push(file);
    });

    const mods = {};
    const filesMinusDirs = {};
    Object.entries(filesForBase).forEach(([base, files]) => {
        // 处理文件夹
        files.forEach(file => {
            const abs = Path.resolve(dir, file);

            if (abs === parentFile || (opts.filter && !opts.filter(abs))) return;

            if (fs.statSync(abs).isDirectory()) {
                if (base === 'node_modules') return;
                if (opts.recurse) {
                    mods[base] = requireDir(abs, opts);

                    if (opts.duplicates) mods[file] = mods[base];
                }
            } else {
                filesMinusDirs[file] = abs;
            }
        });

        if (mods[base] && !opts.duplicates) return;

        // 处理文件以及优先级
        opts.extensions.some(ext => {
            const file = `${base}${ext}`;
            const abs = filesMinusDirs[file];

            if (abs) {
                if (/\.d\.ts$/.test(abs)) return;

                if (opts.noCache) delete require.cache[abs];

                if (opts.duplicates) mods[file] = require(abs);

                if (!mods[base]) {
                    mods[base] = require(abs);
                    if (!opts.duplicates) return true;
                }
            }
        });
    });

    if (opts.mapKey || opts.mapValue) {
        Object.entries(mods).forEach(([key, mod]) => {
            const mappedKey = opts.mapKey ? opts.mapKey(mod, key) : key;
            const mappedValue = opts.mapValue ? opts.mapValue(mod, mappedKey) : mod;

            delete mods[key];
            mods[mappedKey] = mappedValue;
        });
    }

    return mods;
}

module.exports = requireDir;
