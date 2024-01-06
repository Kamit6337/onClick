const download = (response) => {
  // Convert the response to a blob and create a download link
  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);

  // Extract filename from response headers or use a fixed name
  const contentDisposition = response.headers["content-disposition"];
  const fileName = contentDisposition
    ? contentDisposition.split("filename=")[1]
    : "downloadedFile.pdf";

  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};

export default download;

// const a = document.createElement("a");
// const url = window.URL.createObjectURL(blob);

// // Extract filename from response headers or use a fixed name
// const contentDisposition = response.headers["content-disposition"];
// const fileName = contentDisposition
//   ? contentDisposition.split("filename=")[1]
//   : "downloadedFile.pdf";

// a.href = url;
// a.download = fileName;
// document.body.appendChild(a);
// a.click();
// document.body.removeChild(a);
// window.URL.revokeObjectURL(url);
