export const posix = (windowsPath) => windowsPath.replace(/^\\\\\?\\/, "").replace(/\\/g, "\/").replace(/\/\/+/g, "\/");
