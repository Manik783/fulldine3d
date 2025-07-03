from storages.backends.s3boto3 import S3Boto3Storage

class S3Boto3StorageWithoutACL(S3Boto3Storage):
    def _save(self, name, content):
        # Explicitly set ACL to None
        self.default_acl = None
        return super()._save(name, content)