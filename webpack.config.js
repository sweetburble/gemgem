const path = require("path");

module.exports = {
    entry: "./content_script.js", // 원본 코드 경로
    output: {
        filename: "content_script.bundle.js", // 번들 파일명
        path: path.resolve(__dirname, "dist"),
    },
    mode: "production",
    experiments: {
        topLevelAwait: true, // 최상위 await 허용
        outputModule: true, // ES Module 출력 활성화
    },
    target: "es2020", // ES Module 지원 강화
    externals: {},
};
