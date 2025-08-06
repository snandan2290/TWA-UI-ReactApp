const checkValidFileFormat = (validFileExt, fileName) => {
  if (fileName != null) {
    let fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
    if (validFileExt.indexOf(fileExt) == -1) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

export default checkValidFileFormat;
