const AWS = require('aws-sdk');
const ENV_CONFIG = require('../configurations/env_config');
const Path = require('path');



const S3 = new AWS.S3({signatureVersion:'v4',region : ENV_CONFIG.ENV_AWS_REGION});


const reportsBucketName = ENV_CONFIG.ENV_S3_BUCKET_NAME
const signedUrlExpireSeconds = 2 * 60 * 60  // expiry time in seconds



async function S3getSignedUrl( key) {
    const reportsBucketName = ENV_CONFIG.ENV_S3_BUCKET_NAME

    const url = await S3.getSignedUrlPromise( 'getObject', {
        Bucket: reportsBucketName,
        Key: key, // if any sub folder-> path/of/the/folder.ext
        Expires: signedUrlExpireSeconds,
    } );
    return url;
}

async function S3getSignedUrlForEdit( path, type ){ 
    return await S3getSignedUrlForPut(reportsBucketName, path, type)
}

async function S3PutFile(filePath, fileData, ContentType) {
    let bucket = ENV_CONFIG.ENV_S3_BUCKET_NAME



    const params = {
        Bucket: bucket,
        Key:  filePath,
        ContentType:ContentType,
        Body: fileData
    };
    let data
    try {
        data = await S3.putObject(params).promise()
        console.log(`file uploaded `,data)
    } catch (err) {
        console.log("uploading error" + err)
        throw new Error(err)
    }
    return data
}


var fileFilter = function (req, file, callback) {
    let ext = Path.extname(file.originalname)
    callback(null, true) // param 1: no error , param 2 return value
}



async function S3getSignedUrlForPut( bucketName, path/* , metadata*/, type  ) {
    
    const url = await S3.getSignedUrlPromise('putObject', {
        Bucket: bucketName,
        Key: path,
        Expires: signedUrlExpireSeconds,
        ACL: 'bucket-owner-full-control',
        ContentType: type, // 'application/zip', 'binary/octet-stream'
        // Metadata: metadata
    } ); //for PUT it is extremely important to specify the ACL(Access Control List) and the ContentType
// getSignedUrl
    return url;
    // let UploadUrl = await s3Helper.S3getSignedUrlForPut( ENV_CONFIG.ENV_S3_FILES_BUCKET_NAME, fileURL, metaData );
}

async function deleteFileFromS3(fileName) {
    let bucketName =ENV_CONFIG.ENV_S3_BUCKET_NAME
    try {
      const params = {
        Bucket: bucketName,
        Key: fileName
      };
  
      await S3.deleteObject(params).promise();
  
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw error;
    }
  }

module.exports = {
    S3PutFile,
    deleteFileFromS3,
    S3getSignedUrl

}
