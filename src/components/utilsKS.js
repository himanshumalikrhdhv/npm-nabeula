function floatPrecision(floatValue, precision) {
  floatValue = parseFloat(floatValue);
  if (isNaN(floatValue)) {
    return parseFloat("0").toFixed(precision);
  } else {
    const power = Math.pow(10, precision);
    floatValue = (Math.round(floatValue * power) / power).toFixed(precision);
    return floatValue.toString();
  }
}

function fileSize(size) {
  if (size > 1024) {
    const kbSize = size / 1024;
    if (kbSize > 1024) {
      const mbSize = kbSize / 1024;
      return `${floatPrecision(mbSize, 2)} MB`;
    }
    return `${Math.round(kbSize)} kB`;
  }
  return `${size} B`;
}

function convertTime(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

async function blobToString(blob) {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onloadend = (ev) => {
      resolve(ev.target.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsText(blob);
  });
}

function getFolder(arr) {
  if (!arr || arr.length <= 0) {
    return [];
  }
  const arr2 = arr
    .sort(function (a, b) {
      return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
    })
    .map((p) => p.name.split("/"));
  const setNestedObjectField = (obj, props, value) => {
    if (!Array.isArray(obj)) {
      if (!obj.content) {
        obj.content = [];
      }
      obj = obj.content;
    }
    for (const propName of props) {
      const next = obj.find((el) => el.title === propName);
      if (!next) {
        obj.push(value);
      } else {
        if (!next.content) {
          next.content = [];
        }
        obj = next.content;
      }
    }
  };
  const rez = [];
  let index = 0;
  while (arr2.some((s) => s[index] !== undefined)) {
    const layer = arr2.reduce((acc, pathArr) => {
      if (pathArr[index] === undefined) return acc;
      acc.add(pathArr.slice(0, index + 1).join("/"));
      return acc;
    }, new Set());
    for (const key of layer) {
      const props = arr.find((a) => a.name === key);
      setNestedObjectField(rez, key.split("/"), {
        title: key.split("/").at(-1),
        props: props ? props.properties : null,
        key: key,
      });
    }
    index++;
  }
  return rez;
}
function sortArray(arr) {
  if (!arr || arr.length <= 0) return [];
  const newArray = [...arr];
  let folders = newArray.filter((f) => f.content && f.content.length > 0);
  let files = newArray.filter((f) => !f.content || f.content.length <= 0);
  //Sort folders
  folders.sort(function (a, b) {
    return a.title.toLowerCase() > b.title.toLowerCase()
      ? 1
      : a.title.toLowerCase() === b.title.toLowerCase()
      ? 0
      : -1;
  });
  //Sort files
  files.sort(function (a, b) {
    return a.title.toLowerCase() > b.title.toLowerCase()
      ? 1
      : a.title.toLowerCase() === b.title.toLowerCase()
      ? 0
      : -1;
  });
  for (var folder of folders) {
    folder.content = sortArray(folder.content);
  }
  const arrayToReturn = folders;
  arrayToReturn.push(...files);
  return arrayToReturn;
}

function findObject(key, array) {
  for (const node of array) {
    if (node.key === key) return node;
    if (node.content) {
      const child = findObject(key, node.content);
      if (child) return child;
    }
  }
}

export {
  floatPrecision,
  fileSize,
  convertTime,
  blobToString,
  getFolder,
  sortArray,
  findObject,
};
