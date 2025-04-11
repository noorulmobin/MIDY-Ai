(function () {
  if (!/macintosh|mac os x/i.test(navigator.userAgent)) return;
  console.log("::MONITOR::INIT");

  function isDownloadLink(url) {
    const fileExtensions = [
      "3gp",
      "7z",
      "ai",
      "apk",
      "avi",
      "bmp",
      "csv",
      "dmg",
      "doc",
      "docx",
      "fla",
      "flv",
      "gif",
      "gz",
      "gzip",
      "ico",
      "iso",
      "indd",
      "jar",
      "jpeg",
      "jpg",
      "m3u8",
      "mov",
      "mp3",
      "mp4",
      "mpa",
      "mpg",
      "mpeg",
      "msi",
      "odt",
      "ogg",
      "ogv",
      "pdf",
      "png",
      "ppt",
      "pptx",
      "psd",
      "rar",
      "raw",
      "svg",
      "swf",
      "tar",
      "tif",
      "tiff",
      "ts",
      "txt",
      "wav",
      "webm",
      "webp",
      "wma",
      "wmv",
      "xls",
      "xlsx",
      "xml",
      "zip",
      "json",
      "yaml",
      "7zip",
      "mkv",
    ];
    const downloadLinkPattern = new RegExp(
      `\\.(${fileExtensions.join("|")})$`,
      "i"
    );
    return downloadLinkPattern.test(url);
  }

  const isSpecialDownload = (url) =>
    ["blob", "data"].some((protocol) => url.startsWith(protocol));

  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener(
      "click",
      (event) => {
        let link = event.target;

        for (let i = 0; i < 5 && link; i++) {
          if (link.tagName === "A") break;
          link = link.parentElement;
        }

        if (link && link.tagName === "A" && link.href) {
          const url = link.href;
          const target = link.target;
          const download = link.download;
          const eventType =
            isDownloadLink(url) ||
            isSpecialDownload(url) ||
            link.hasAttribute("download")
              ? "downloadFile"
              : "openNewWindow";

          if (eventType) {
            window.parent.postMessage(
              {
                from: "monitor",
                eventType,
                target,
                url,
                download,
              },
              "*"
            );
          }
        }
      },
      true
    );
  });
})();
