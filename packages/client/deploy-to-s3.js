const path = require('path');
const fs = require('fs-extra');
const AWS = require('aws-sdk');
const mime = require('mime');

const upload = async (s3, localFolder, s3RootDir, s3BucketName) => {
  const filesPaths = await walkSync(localFolder);
  for (let i = 0; i < filesPaths.length; i++) {
    const statistics = `(${i + 1}/${filesPaths.length}, ${Math.round(
      ((i + 1) / filesPaths.length) * 100
    )}%)`;
    const filePath = filesPaths[i];
    const fileContent = fs.readFileSync(filePath);
    // If the slash is like this "/" s3 will create a new folder, otherwise will not work properly.
    const relativeToBaseFilePath = path.normalize(
      path.relative(localFolder, filePath)
    );
    s3RootDir = s3RootDir || '';
    const relativeToBaseFilePathForS3 = path
      .join(s3RootDir, relativeToBaseFilePath)
      .split(path.sep)
      .join('/');

    const mimeType = mime.getType(filePath);
    console.log(`Uploading`, statistics, relativeToBaseFilePathForS3);
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    await s3
      .putObject({
        ACL: `public-read`,
        Bucket: s3BucketName,
        Key: relativeToBaseFilePathForS3,
        Body: fileContent,
        ContentType: mimeType,
      })
      .promise();
    console.log(`Uploaded `, statistics, relativeToBaseFilePathForS3);
  }
};

async function walkSync(dir) {
  const files = fs.readdirSync(dir);
  const output = [];
  for (const file of files) {
    const pathToFile = path.join(dir, file);
    const isDirectory = fs.statSync(pathToFile).isDirectory();
    if (isDirectory) {
      output.push(...(await walkSync(pathToFile)));
    } else {
      output.push(await pathToFile);
    }
  }
  return output;
}

const deployToS3 = async (config) => {
  AWS.config.setPromisesDependency(Promise);

  const s3 = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKeyId,
    region: config.region,
    endpoint: config.endPoint,
  });

  //上传本地文件到 s3
  await upload(s3, config.localFolder, config.folder, config.s3BucketName);
  console.log('发布完毕');
};

deployToS3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKeyId: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endPoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com.cn`,
  localFolder: __dirname + '/build',
  folder: process.env.AWS_PATH,
  s3BucketName: process.env.AWS_BUCKET,
});
