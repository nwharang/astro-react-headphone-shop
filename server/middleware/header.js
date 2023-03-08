export const header = (req, res, next) => {
  if (!req.url.includes("/trpc/"))
    res.set({
      "x-timestamp": Date.now(),
      "Cache-Control": "public, max-age=3600",
      "Document-Policy": `document-write=?0`,
      "Content-Security-Policy": `default-src *; font-src 'self' https://fonts.gstatic.com; img-src *; script-src 'self' https://www.google.com https://www.gstatic.com 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; frame-src 'self' https://www.google.com/;`,
    });
  res.removeHeader("X-Powered-By");
  next();
};
