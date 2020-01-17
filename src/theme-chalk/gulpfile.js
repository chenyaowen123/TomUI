"use strict";
const { watch, series, src, dest, parallel } = require("gulp");
const postcss = require("gulp-postcss");
const less = require("gulp-less");
const cssmin = require("gulp-cssmin"); // gulp的模块压缩
const pxtounits = require("postcss-px2units");
const pxtoviewport = require("postcss-px-to-viewport");
const cssnano = require("cssnano"); // cssnano是PostCSS的CSS优化和分解插件。cssnano采用格式很好的CSS，并通过许多优化，以确保最终的生产环境尽可能小
const presetenv = require("postcss-preset-env"); // 浏览器兼容处理
const rename = require("gulp-rename");
const tobem = require("postcss-bem-fix"); // bem规范

let bemConfig = {
    shortcuts: {
        component: "b",
        modifier: "m",
        descendent: "e"
    },
    separators: {
        descendent: "__",
        modifier: "--"
    }
};

function compileCssToVw() {
    return src("./src/*.less")
        .pipe(less())
        .pipe(
            postcss([
                tobem(bemConfig),
                pxtoviewport({
                    viewportWidth: 750, // (Number) The width of the viewport.
                    viewportHeight: 1334, // (Number) The height of the viewport.
                    unitPrecision: 3, // (Number) 转换的时候除不尽保留3位小数.
                    viewportUnit: "vw", // (String) 转换为vw单位.
                    selectorBlackList: [".ignore", ".hairlines"], // (Array) The selectors to ignore and leave as px.
                    minPixelValue: 1, // (Number) 小于或等于'1px'不转换为视窗单位.
                    mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
                    unitToConvert: "px"
                }),
                presetenv(),
                cssnano({
                    "cssnano-preset-advanced": {
                        zindex: false,
                        autoprefixer: false
                    }
                })
            ])
        )
        .pipe(cssmin())
        .pipe(rename({ suffix: ".vw" }))
        .pipe(dest("./lib"));
}

function compileCssToPx() {
    return src("./src/*.less")
        .pipe(less())
        .pipe(
            postcss([
                tobem(bemConfig),
                presetenv(),
                pxtounits({
                    divisor: 2,
                    targetUnits: "px"
                })
            ])
        )
        .pipe(cssmin())
        .pipe(rename({ suffix: ".px" }))
        .pipe(dest("./lib"));
}

function copyFont() {
    return src("./src/fonts/**").pipe(dest("./lib/fonts"));
}

function watchCss() {
    return watch("./src/*.less", parallel(compileCssToVw, compileCssToPx));
}

function watchFonts() {
    return watch("./src/fonts/**", copyFont);
}

exports.build = parallel(compileCssToVw, compileCssToPx, copyFont);
exports.default = series(
    compileCssToVw,
    compileCssToPx,
    copyFont,
    parallel(watchCss, watchFonts)
);
