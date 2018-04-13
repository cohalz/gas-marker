// 振り分け関数
// fileId -> zipfileのID
// divideRates -> 振り分け比率の文字列(ex: "1,1,1")
function divide(fileId, divideRates, fileName){
    const zipped = DriveApp.getFileById(fileId)
    const unzippedFiles = unzip(zipped)

    const folder = DriveApp.getFolderById(globalVariables().rootFolderId)
    const ratesArray = divideRates.split(",")
    const divFolders = makeDivideFolders(folder, zipped, ratesArray.length, fileName)

    ratesArray = divideRates.split(",")
    const mapping = divideFiles2folders(unzippedFiles, divFolders, ratesArray)

    // mapping = [[folder1, file1],[folder1, file2],..., [folder2, fileK], [folder2, fileK+1]...]
    return mapping
}

// 振り分ける
function divideFiles2folders(unzippedFiles, divFolders, divideRates) {
  // 小数にする
  const decRates = convDecimal(divideRates)
    // 母数を加味して分類する数をもとめる
    var divNums = decRates.map(function(n) {
        return Math.round(n*unzippedFiles.length)
        })

  // 最後の配列を調整する。
  const nDiv = divNums.length
    var nFilesWithoutLast = 0
    for(var i = 0; i < nDiv - 1;i++) {
      nFilesWithoutLast += divNums[i]
    }
  divNums[nDiv - 1] = unzippedFiles.length - nFilesWithoutLast

    // シャッフルする
    files = unzippedFiles.sort(function() {return Math.random()-0.5});

  // 実際にファイルに対応させる
  const filesAry = divNums.map(function(n) {
      return files.splice(0, n)
      })

  // ファイルにディレクトリを対応させる
  var mapping = []
    for(var i = 0; i < nDiv;i++) {
      for (var j = 0;j < filesAry[i].length;j++) {
        divFolders[i].createFile(filesAry[i][j])
          var group = divFolders[i].getName()
          var id = filesAry[i][j].getName().split('.')[0]
          mapping.push([group, id])
      }
    }

  mapping.sort(function(m1, m2) {
      if (m1[0] < m2[0]) {
      return -1
      } else if (m1[0] > m2[0]) {
      return 1
      } else {
      if(m1[1] < m2[1]){
      return -1
      } else if (m1[1] > m2[1]) {
      return 1
      } else {
      return 0
      }
      }
      })

  return mapping
}

function convDecimal(rateAry){
  n = rateAry.length
    return rateAry.map(function(num) {return num/n})
}

// ファイルを解凍してその中身のファイルの情報を返す。
function unzip (zipped) {
  var unzipped = Utilities.unzip(zipped).filter(function(file) {
      return file.getName().slice(-1) != '/' // ディレクトリでないもののみ取得
      })

  // 学籍番号昇順
  unzipped.sort(function(f1,f2){
      const i1 = f1.getName().split('/')[1].split('.')[0]
      const i2 = f2.getName().split('/')[1].split('.')[0]
      if (i1 < i2) {
      return 1
      } else if (i1 > i2) {
      return -1
      } else {
      // 学籍が同じ場合、日付昇順
      const d1 = f1.getName().split('/')[0]
      const d2 = f2.getName().split('/')[0]
      if(d1 < d2){
      return 1
      } else if (d1 < d2) {
      return -1
      } else {
      return 0
      }
      }
      })

  // 名前を学籍のみに変更
  var files = unzipped.map(function(file) {
      const id = file.getName().split('/')[1]
      file.setName(id)
      return file
      })

  // 重複を消す
  var idx = 0
    var id = files[0].getName().split('.')[0] // 学籍番号
    var tmp = []
    tmp.push(files[0])
    for(var i = 1; i < files.length; i++) {
      var fId = files[i].getName().split('.')[0] // 学籍番号
        if(id == fId) {
          // 同一IDの場合、日付が新しいものに更新
          tmp[idx] = files[i]
        } else {
          tmp.push(files[i])
            id = fId
            idx = idx + 1
        }
    }
  files = tmp

    return files
}

// 振り分け用のフォルダの作成だけを行い、そのフォルダの情報を返す。
function makeDivideFolders(folder, zipped, nDiv, fileName) {
  const storeFolder = folder.createFolder(fileName)
    var divFolders = []
    for (var i = 0; i < nDiv; i++){
      var f = storeFolder.createFolder(String.fromCharCode("A".charCodeAt() + i))
        divFolders.push(f)
    }

  return divFolders
}
