<template>
  <div class="document-converter">
    <h2>文档转换工具</h2>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">文档格式转换</h5>
        <p>将普通文档转换为符合标准格式的Demo文档</p>

        <!-- 步骤1：下载模板 -->
        <div class="mb-3">
          <a href="http://localhost:5001/download-demo-template" class="btn btn-primary" target="_blank">
            下载标准Demo模板
          </a>
        </div>

        <!-- 步骤2：上传模板 -->
        <div class="mb-3">
          <a href="http://localhost:5001/upload-demo-page" class="btn btn-secondary" target="_blank">
            上传并验证Demo模板
          </a>
        </div>

        <!-- 步骤3：上传待转换文档 -->
        <div class="mb-3">
          <a href="http://localhost:5001/convert-page" class="btn btn-info" target="_blank">
            上传并转换文档
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentConverter'
}
</script>

<style scoped>
.document-converter {
  padding: 20px;
}
.card {
  margin-top: 15px;
}
</style>